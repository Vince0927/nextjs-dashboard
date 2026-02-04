const postgres = require('postgres');

const sql = postgres('postgresql://postgres:Postgresql144@127.0.0.1:5432/neondb', {
  ssl: false,
  connect_timeout: 5,
  idle_timeout: 0,
  max_lifetime: 0,
  max: 1,
});

async function testConnection() {
  try {
    console.log('🔌 Testing PostgreSQL connection...');
    const result = await sql`SELECT * FROM revenue LIMIT 1`;
    console.log('✅ Connected successfully!');
    console.log('📊 Sample revenue data:', result);
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    await sql.end();
    process.exit(1);
  }
}

testConnection();

