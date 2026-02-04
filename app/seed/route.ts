import bcrypt from "bcryptjs";

import postgres from "postgres";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function seedUsers(client: typeof sql) {
  await client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices(client: typeof sql) {
  await client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers(client: typeof sql) {
  await client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue(client: typeof sql) {
  await client`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    // Check if database URL is configured
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      throw new Error(
        "POSTGRES_URL_NON_POOLING environment variable is not set",
      );
    }

    console.log("Starting database seeding...");
    console.log("Database host:", process.env.POSTGRES_HOST);

    await sql.begin(async (sql) => {
      console.log("Seeding users...");
      await seedUsers(sql);
      console.log("Seeding customers...");
      await seedCustomers(sql);
      console.log("Seeding invoices...");
      await seedInvoices(sql);
      console.log("Seeding revenue...");
      await seedRevenue(sql);
    });

    console.log("Database seeded successfully!");
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);

    // Provide more helpful error messages
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for common Neon errors
      if (
        error.message.includes("CONNECT_TIMEOUT") ||
        error.message.includes("ETIMEDOUT")
      ) {
        errorMessage =
          "Database connection timeout. The database might be suspended (Neon free tier). Please try again in a few seconds to wake it up.";
      }
    }

    return Response.json(
      {
        error: errorMessage,
        details: error,
      },
      { status: 500 },
    );
  }
}
