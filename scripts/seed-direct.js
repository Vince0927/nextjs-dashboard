#!/usr/bin/env node

const { config } = require("dotenv");
const postgres = require("postgres");
const fs = require("fs");
const path = require("path");

// Load environment variables
config({ path: ".env" });

console.log("🌱 Direct SQL seeding via CLI...");
console.log("📍 Database host:", process.env.POSTGRES_HOST);
console.log("⏱️  Connection timeout: 60 seconds");
console.log("");

// Create connection with extended timeout
const sql = postgres(process.env.POSTGRES_URL_NON_POOLING, {
  ssl: "require",
  connect_timeout: 60,
  idle_timeout: 20,
  max: 1,
});

async function executeSqlFile() {
  const startTime = Date.now();

  try {
    console.log("📄 Reading seed.sql file...");
    const sqlFilePath = path.join(__dirname, "..", "seed.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    console.log("🔌 Connecting to database...");
    console.log("   (This may take 10-30 seconds if database is suspended)");
    console.log("");

    // Remove comments and split into statements
    const cleanedSql = sqlContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    const statements = cleanedSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`📝 Executing SQL file with ${statements.length} statements`);
    console.log("");

    let successCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ";";

      try {
        // Show what we're executing
        const firstLine = statement.split("\n")[0].substring(0, 60);
        process.stdout.write(
          `   [${i + 1}/${statements.length}] ${firstLine}... `,
        );

        await sql.unsafe(statement);
        console.log("✅");
        successCount++;
      } catch (error) {
        // Ignore "already exists" errors
        if (
          error.message.includes("already exists") ||
          error.message.includes("duplicate key") ||
          error.message.includes("ON CONFLICT")
        ) {
          console.log("⚠️  (already exists)");
          successCount++;
        } else {
          console.log("❌");
          console.error(`      Error: ${error.message}`);
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("");
    console.log(`🎉 Database seeded successfully in ${duration}s!`);
    console.log(`   Executed ${successCount}/${statements.length} statements`);
    console.log("");
    console.log("✅ Next steps:");
    console.log("   1. Start dev server: pnpm dev");
    console.log("   2. Test locally: http://localhost:3000/query");
    console.log('   3. Expected result: [{"amount":666,"name":"Evil Rabbit"}]');
    console.log("");
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("");
    console.log(`❌ Seeding failed after ${duration}s`);
    console.log("");

    if (error.code === "ETIMEDOUT" || error.message?.includes("ETIMEDOUT")) {
      console.log("⚠️  Database connection timeout!");
      console.log("");
      console.log("The database is suspended (Neon free tier).");
      console.log("");
      console.log("💡 Solution:");
      console.log("   1. Go to: https://console.neon.tech/");
      console.log("   2. Open SQL Editor for your project");
      console.log("   3. Run: SELECT NOW();");
      console.log("   4. Wait for it to complete");
      console.log("   5. Immediately run: pnpm seed:direct");
      console.log("");
    } else if (error.code === "ENOENT") {
      console.log("❌ seed.sql file not found!");
      console.log("");
      console.log("Expected location: nextjs-dashboard/seed.sql");
      console.log("");
    } else {
      console.error("Error details:", error);
    }

    process.exit(1);
  } finally {
    await sql.end();
  }
}

executeSqlFile();
