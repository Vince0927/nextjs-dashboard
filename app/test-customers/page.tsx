import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: process.env.POSTGRES_HOST === 'localhost' ? false : 'require' 
});

export default async function TestCustomersPage() {
  // Fetch all customers
  const customers = await sql`
    SELECT * FROM customers
    ORDER BY name
  `;

  // Fetch customers with their invoice counts
  const customersWithInvoices = await sql`
    SELECT 
      customers.name,
      customers.email,
      COUNT(invoices.id) as invoice_count,
      SUM(invoices.amount) as total_amount
    FROM customers
    LEFT JOIN invoices ON customers.id = invoices.customer_id
    GROUP BY customers.id, customers.name, customers.email
    ORDER BY total_amount DESC
  `;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>👥 Customers from PostgreSQL</h1>
      
      <h2>All Customers:</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#0070f3', color: 'white' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Image</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.name}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.email}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.image_url}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>Customers with Invoice Summary:</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#10b981', color: 'white' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Invoices</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {customersWithInvoices.map((customer) => (
            <tr key={customer.email}>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.name}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.email}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{customer.invoice_count}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                ${(Number(customer.total_amount) / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>Raw JSON Data:</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(customersWithInvoices, null, 2)}
      </pre>
    </div>
  );
}

