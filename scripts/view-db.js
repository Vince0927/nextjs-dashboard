#!/usr/bin/env node

const postgres = require("postgres");

console.log("🗄️  PostgreSQL Database Viewer");
console.log("================================");
console.log("");

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "neondb",
  username: "postgres",
  password: "Postgresql144",
  ssl: false,
});

async function viewDatabase() {
  try {
    console.log("📊 TABLES");
    console.log("─────────────────────────────────────────");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    tables.forEach(t => console.log(`  • ${t.table_name}`));
    console.log("");

    // USERS TABLE
    console.log("👤 USERS TABLE");
    console.log("─────────────────────────────────────────");
    const users = await sql`SELECT * FROM users`;
    console.table(users.map(u => ({
      id: u.id.substring(0, 8) + '...',
      name: u.name,
      email: u.email,
      password: u.password.substring(0, 20) + '...'
    })));

    // CUSTOMERS TABLE
    console.log("👥 CUSTOMERS TABLE");
    console.log("─────────────────────────────────────────");
    const customers = await sql`SELECT * FROM customers ORDER BY name`;
    console.table(customers.map(c => ({
      id: c.id.substring(0, 8) + '...',
      name: c.name,
      email: c.email,
      image: c.image_url
    })));

    // INVOICES TABLE
    console.log("📄 INVOICES TABLE");
    console.log("─────────────────────────────────────────");
    const invoices = await sql`
      SELECT 
        invoices.id,
        customers.name as customer,
        invoices.amount,
        invoices.status,
        invoices.date
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
    `;
    console.table(invoices.map(i => ({
      id: i.id.substring(0, 8) + '...',
      customer: i.customer,
      amount: '$' + (i.amount / 100).toFixed(2),
      status: i.status,
      date: i.date.toISOString().split('T')[0]
    })));

    // REVENUE TABLE
    console.log("💰 REVENUE TABLE");
    console.log("─────────────────────────────────────────");
    const revenue = await sql`SELECT * FROM revenue ORDER BY month`;
    console.table(revenue.map(r => ({
      month: r.month,
      revenue: '$' + r.revenue.toLocaleString()
    })));

    // STATISTICS
    console.log("📈 STATISTICS");
    console.log("─────────────────────────────────────────");
    const stats = await sql`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount
      FROM invoices
    `;
    console.log(`  Total Invoices: ${stats[0].total_invoices}`);
    console.log(`  Total Amount: $${(Number(stats[0].total_amount) / 100).toFixed(2)}`);
    console.log(`  Average Amount: $${(Number(stats[0].avg_amount) / 100).toFixed(2)}`);
    console.log("");

    const byStatus = await sql`
      SELECT status, COUNT(*) as count, SUM(amount) as total
      FROM invoices
      GROUP BY status
    `;
    console.log("  By Status:");
    byStatus.forEach(s => {
      console.log(`    ${s.status}: ${s.count} invoices, $${(Number(s.total) / 100).toFixed(2)}`);
    });
    console.log("");

    // SPECIAL QUERIES
    console.log("🎯 SPECIAL QUERIES");
    console.log("─────────────────────────────────────────");
    
    const evilRabbit = await sql`
      SELECT invoices.*, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666
    `;
    console.log("  Evil Rabbit Invoice (amount = 666):");
    console.table(evilRabbit.map(i => ({
      customer: i.name,
      amount: '$' + (i.amount / 100).toFixed(2),
      status: i.status,
      date: i.date.toISOString().split('T')[0]
    })));

    console.log("✅ Database view complete!");
    console.log("");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

viewDatabase();

