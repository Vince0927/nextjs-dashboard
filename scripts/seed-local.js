#!/usr/bin/env node

const postgres = require("postgres");
const fs = require("fs");
const path = require("path");

console.log("🌱 Seeding LOCAL PostgreSQL database...");
console.log("📍 Host: localhost");
console.log("👤 User: postgres");
console.log("🗄️  Database: neondb");
console.log("");

// Function to create connection
function createConnection(database = "neondb") {
  return postgres({
    host: "localhost",
    port: 5432,
    database: database,
    username: "postgres",
    password: "Postgresql144",
    ssl: false,
  });
}

let sql = null;

async function seed() {
  const start = Date.now();

  try {
    console.log("📄 Reading seed.sql...");
    const sqlFile = path.join(__dirname, "..", "seed.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    console.log("🔌 Connecting to local PostgreSQL...");

    // First, try to connect to postgres database to create neondb if needed
    let postgresDb = createConnection("postgres");

    try {
      // Check if neondb exists
      const result = await postgresDb`
        SELECT 1 FROM pg_database WHERE datname = 'neondb'
      `;

      if (result.length === 0) {
        console.log("📦 Database 'neondb' doesn't exist. Creating it...");
        await postgresDb.unsafe("CREATE DATABASE neondb");
        console.log("✅ Database 'neondb' created!");
      } else {
        console.log("✅ Database 'neondb' exists!");
      }
    } finally {
      await postgresDb.end();
    }

    // Now connect to neondb
    sql = createConnection("neondb");

    // Test connection
    await sql`SELECT version()`;
    console.log("✅ Connected to neondb successfully!");
    console.log("");

    console.log("🌱 Executing seed SQL...");

    // Execute the entire SQL file
    await sql.unsafe(sqlContent);

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log("");
    console.log(`🎉 Database seeded successfully in ${duration}s!`);
    console.log("");
    console.log("📊 Seeded data:");
    console.log("   • 1 user (email: user@nextmail.com, password: 123456)");
    console.log("   • 6 customers");
    console.log("   • 13 invoices");
    console.log("   • 12 revenue records");
    console.log("");
    console.log("✅ Next steps:");
    console.log("   1. Update .env to use local database");
    console.log("   2. Run: pnpm dev");
    console.log("   3. Visit: http://localhost:3000/query");
    console.log('   4. Expected: [{"amount":666,"name":"Evil Rabbit"}]');
    console.log("");
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log("");
    console.log(`❌ Seeding failed after ${duration}s`);
    console.log("");

    if (error.code === "ECONNREFUSED") {
      console.log("⚠️  Cannot connect to PostgreSQL!");
      console.log("");
      console.log("Make sure PostgreSQL is running:");
      console.log("   • Windows: Check Services for 'postgresql'");
      console.log("   • Or start manually");
      console.log("");
    } else if (
      error.message.includes("database") &&
      error.message.includes("does not exist")
    ) {
      console.log("⚠️  Database 'neondb' does not exist!");
      console.log("");
      console.log("Create it first:");
      console.log('   psql -U postgres -c "CREATE DATABASE neondb;"');
      console.log("");
    } else if (error.message.includes("password authentication failed")) {
      console.log("⚠️  Password authentication failed!");
      console.log("");
      console.log("Check your PostgreSQL password.");
      console.log("Current password in script: Postgresql144");
      console.log("");
    } else {
      console.error("Error:", error.message);
      console.error("");
      console.error("Full error:", error);
    }

    process.exit(1);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

seed();
