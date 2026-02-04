#!/usr/bin/env node

const postgres = require("postgres");

console.log("🔍 Checking LOCAL PostgreSQL database...");
console.log("📍 Host: localhost");
console.log("👤 User: postgres");
console.log("🗄️  Database: neondb");
console.log("");

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "neondb",
  username: "postgres",
  password: "Postgresql144",
  ssl: false,
});

async function checkDatabase() {
  try {
    console.log("🔌 Connecting...");
    
    // Check tables
    console.log("\n📊 Checking tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    if (tables.length === 0) {
      console.log("❌ No tables found! Database is empty.");
      console.log("\n💡 Run: pnpm seed:local");
      process.exit(1);
    }
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`   • ${t.table_name}`));
    
    // Check record counts
    console.log("\n📈 Record counts:");
    
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`   • Users: ${userCount[0].count}`);
    
    const customerCount = await sql`SELECT COUNT(*) as count FROM customers`;
    console.log(`   • Customers: ${customerCount[0].count}`);
    
    const invoiceCount = await sql`SELECT COUNT(*) as count FROM invoices`;
    console.log(`   • Invoices: ${invoiceCount[0].count}`);
    
    const revenueCount = await sql`SELECT COUNT(*) as count FROM revenue`;
    console.log(`   • Revenue: ${revenueCount[0].count}`);
    
    // Show sample data
    console.log("\n🎯 Sample data (Evil Rabbit invoice):");
    const evilRabbit = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    
    if (evilRabbit.length > 0) {
      console.log(`   ✅ Found: ${JSON.stringify(evilRabbit[0])}`);
    } else {
      console.log("   ❌ Evil Rabbit invoice not found!");
    }
    
    console.log("\n✅ Database is properly seeded!");
    console.log("\n🚀 Next steps:");
    console.log("   1. Run: pnpm dev");
    console.log("   2. Visit: http://localhost:3000/query");
    console.log("   3. Expected: [{\"amount\":666,\"name\":\"Evil Rabbit\"}]");
    
  } catch (error) {
    console.log("\n❌ Error checking database:");
    
    if (error.message.includes("does not exist")) {
      console.log("   Database 'neondb' does not exist!");
      console.log("\n💡 Run: pnpm seed:local");
    } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
      console.log("   Tables don't exist! Database needs to be seeded.");
      console.log("\n💡 Run: pnpm seed:local");
    } else {
      console.error("   ", error.message);
    }
    
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkDatabase();

