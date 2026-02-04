#!/usr/bin/env node

const { config } = require("dotenv");
const postgres = require("postgres");
const fs = require("fs");
const path = require("path");

// Load environment variables
config({ path: ".env" });

console.log("🌱 Simple SQL seeding...");
console.log("📍 Host:", process.env.POSTGRES_HOST);
console.log("");

// Use the pooled connection for better reliability
const sql = postgres(process.env.POSTGRES_URL, {
  ssl: "require",
  connect_timeout: 90,
  max: 1,
});

async function seed() {
  const start = Date.now();
  
  try {
    console.log("📄 Reading seed.sql...");
    const sqlFile = path.join(__dirname, "..", "seed.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");
    
    console.log("🔌 Connecting (may take 30-60s if suspended)...");
    
    // Execute the entire SQL file
    await sql.unsafe(sqlContent);
    
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log("");
    console.log(`✅ Seeded in ${duration}s!`);
    console.log("");
    console.log("Test with: pnpm dev");
    console.log("Then visit: http://localhost:3000/query");
    
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log("");
    console.log(`❌ Failed after ${duration}s`);
    
    if (error.code === "ETIMEDOUT") {
      console.log("");
      console.log("⚠️  Timeout! Database is suspended.");
      console.log("");
      console.log("Wake it up:");
      console.log("1. Go to: https://console.neon.tech/");
      console.log("2. SQL Editor → Run: SELECT 1;");
      console.log("3. Wait for result");
      console.log("4. Run: pnpm seed:simple");
    } else {
      console.error("Error:", error.message);
    }
    
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();

