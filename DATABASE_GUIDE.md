# 🗄️ PostgreSQL Database Access Guide

## Your Database Setup

**Connection Details:**

- Host: `localhost`
- Port: `5432`
- Database: `neondb`
- User: `postgres`
- Password: `Postgresql144`

**Tables:**

- `users` - 1 user (email: user@nextmail.com, password: 123456)
- `customers` - 6 customers
- `invoices` - 13 invoices
- `revenue` - 12 monthly revenue records

---

## How to Access Data in Next.js

### 1. Import the SQL Client

```typescript
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_HOST === "localhost" ? false : "require",
});
```

### 2. Query Examples

#### Simple SELECT

```typescript
const users = await sql`SELECT * FROM users`;
const customers = await sql`SELECT * FROM customers`;
const invoices = await sql`SELECT * FROM invoices`;
const revenue = await sql`SELECT * FROM revenue`;
```

#### WHERE Clause

```typescript
const evilRabbit = await sql`
  SELECT * FROM customers 
  WHERE name = 'Evil Rabbit'
`;

const paidInvoices = await sql`
  SELECT * FROM invoices 
  WHERE status = 'paid'
`;
```

#### JOIN Tables

```typescript
const invoicesWithCustomers = await sql`
  SELECT 
    invoices.amount,
    invoices.status,
    invoices.date,
    customers.name,
    customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
`;
```

#### Parameterized Queries (Prevents SQL Injection)

```typescript
const customerId = "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa";
const customerInvoices = await sql`
  SELECT * FROM invoices 
  WHERE customer_id = ${customerId}
`;
```

#### Aggregate Functions

```typescript
const stats = await sql`
  SELECT 
    COUNT(*) as total,
    SUM(amount) as sum,
    AVG(amount) as average,
    MAX(amount) as max,
    MIN(amount) as min
  FROM invoices
`;
```

#### GROUP BY

```typescript
const byStatus = await sql`
  SELECT 
    status,
    COUNT(*) as count,
    SUM(amount) as total
  FROM invoices
  GROUP BY status
`;
```

---

## Using Data in Pages

### Server Component (Recommended)

```typescript
// app/my-page/page.tsx
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_HOST === 'localhost' ? false : 'require'
});

export default async function MyPage() {
  const data = await sql`SELECT * FROM customers`;

  return (
    <div>
      {data.map(customer => (
        <div key={customer.id}>
          <h2>{customer.name}</h2>
          <p>{customer.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### API Route

```typescript
// app/api/customers/route.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_HOST === "localhost" ? false : "require",
});

export async function GET() {
  const customers = await sql`SELECT * FROM customers`;
  return Response.json(customers);
}
```

### Using Existing Functions from data.ts

```typescript
// app/my-page/page.tsx
import { fetchRevenue } from '@/app/lib/data';

export default async function MyPage() {
  const revenue = await fetchRevenue();

  return (
    <div>
      {revenue.map(r => (
        <p key={r.month}>{r.month}: ${r.revenue}</p>
      ))}
    </div>
  );
}
```

---

## Test Pages Created

Visit these URLs to see examples:

1. **Revenue Data**: http://localhost:3000/test-data
2. **Customers**: http://localhost:3000/test-customers
3. **All Examples**: http://localhost:3000/database-examples
4. **Query Test**: http://localhost:3000/query

---

## Common Patterns

### Error Handling

```typescript
try {
  const data = await sql`SELECT * FROM customers`;
  return data;
} catch (error) {
  console.error("Database Error:", error);
  throw new Error("Failed to fetch data");
}
```

### TypeScript Types

```typescript
import { Revenue } from "@/app/lib/definitions";

const revenue = await sql<Revenue[]>`SELECT * FROM revenue`;
```

---

## Quick Commands

```bash
# Check database status
pnpm check:db

# Reseed database
pnpm seed:local

# Start dev server
pnpm dev
```
