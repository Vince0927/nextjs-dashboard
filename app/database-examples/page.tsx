import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: process.env.POSTGRES_HOST === 'localhost' ? false : 'require' 
});

export default async function DatabaseExamplesPage() {
  // Example 1: Simple SELECT
  const allUsers = await sql`SELECT * FROM users`;

  // Example 2: SELECT with WHERE clause
  const evilRabbit = await sql`
    SELECT * FROM customers 
    WHERE name = 'Evil Rabbit'
  `;

  // Example 3: JOIN tables
  const invoicesWithCustomers = await sql`
    SELECT 
      invoices.id,
      invoices.amount,
      invoices.status,
      invoices.date,
      customers.name as customer_name,
      customers.email as customer_email
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    LIMIT 5
  `;

  // Example 4: Aggregate functions
  const stats = await sql`
    SELECT 
      COUNT(*) as total_invoices,
      SUM(amount) as total_amount,
      AVG(amount) as average_amount,
      MAX(amount) as max_amount,
      MIN(amount) as min_amount
    FROM invoices
  `;

  // Example 5: GROUP BY
  const invoicesByStatus = await sql`
    SELECT 
      status,
      COUNT(*) as count,
      SUM(amount) as total
    FROM invoices
    GROUP BY status
  `;

  // Example 6: Using parameters (safe from SQL injection)
  const searchAmount = 666;
  const specificInvoices = await sql`
    SELECT invoices.*, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = ${searchAmount}
  `;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1200px' }}>
      <h1>🗄️ PostgreSQL Query Examples</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>1️⃣ Simple SELECT - All Users</h2>
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          {JSON.stringify(allUsers, null, 2)}
        </pre>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2️⃣ WHERE Clause - Find Evil Rabbit</h2>
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          {JSON.stringify(evilRabbit, null, 2)}
        </pre>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3️⃣ JOIN - Invoices with Customer Names</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0070f3', color: 'white' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Customer</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoicesWithCustomers.map((inv) => (
              <tr key={inv.id}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{inv.customer_name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>${(inv.amount / 100).toFixed(2)}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{inv.status}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{inv.date.toISOString().split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4️⃣ Aggregate Functions - Invoice Statistics</h2>
        <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          <p><strong>Total Invoices:</strong> {stats[0].total_invoices}</p>
          <p><strong>Total Amount:</strong> ${(Number(stats[0].total_amount) / 100).toFixed(2)}</p>
          <p><strong>Average Amount:</strong> ${(Number(stats[0].average_amount) / 100).toFixed(2)}</p>
          <p><strong>Max Amount:</strong> ${(Number(stats[0].max_amount) / 100).toFixed(2)}</p>
          <p><strong>Min Amount:</strong> ${(Number(stats[0].min_amount) / 100).toFixed(2)}</p>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>5️⃣ GROUP BY - Invoices by Status</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#10b981', color: 'white' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Count</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoicesByStatus.map((row) => (
              <tr key={row.status}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{row.status}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{row.count}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>${(Number(row.total) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>6️⃣ Parameterized Query - Amount = 666</h2>
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          {JSON.stringify(specificInvoices, null, 2)}
        </pre>
      </section>
    </div>
  );
}

