import { fetchRevenue } from '@/app/lib/data';

export default async function TestDataPage() {
  // Fetch data from PostgreSQL
  const revenue = await fetchRevenue();

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>📊 Revenue Data from PostgreSQL</h1>
      
      <h2>Raw Data:</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
        {JSON.stringify(revenue, null, 2)}
      </pre>

      <h2>Formatted Table:</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#0070f3', color: 'white' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Month</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {revenue.map((row) => (
            <tr key={row.month}>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{row.month}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>${row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

