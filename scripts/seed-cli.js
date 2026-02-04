#!/usr/bin/env node

const { config } = require("dotenv");
const postgres = require("postgres");
const bcrypt = require("bcryptjs");

// Load environment variables
config({ path: ".env" });

console.log("🌱 Starting database seeding via CLI...");
console.log("📍 Database host:", process.env.POSTGRES_HOST);
console.log("⏱️  Connection timeout: 60 seconds");
console.log("");

// Create connection with extended timeout
const sql = postgres(process.env.POSTGRES_URL_NON_POOLING, {
  ssl: "require",
  connect_timeout: 60,
  idle_timeout: 20,
  max: 1,
});

// Placeholder data
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

const customers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    image_url: "/customers/evil-rabbit.png",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
    image_url: "/customers/delba-de-oliveira.png",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Lee Robinson",
    email: "lee@robinson.com",
    image_url: "/customers/lee-robinson.png",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Novotny",
    email: "michael@novotny.com",
    image_url: "/customers/michael-novotny.png",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Amy Burns",
    email: "amy@burns.com",
    image_url: "/customers/amy-burns.png",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Balazs Orban",
    email: "balazs@orban.com",
    image_url: "/customers/balazs-orban.png",
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: "paid",
    date: "2022-10-29",
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: "paid",
    date: "2023-09-10",
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: "pending",
    date: "2023-08-05",
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: "pending",
    date: "2023-07-16",
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: "pending",
    date: "2023-06-27",
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: "paid",
    date: "2023-06-09",
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: "paid",
    date: "2023-06-17",
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: "paid",
    date: "2023-06-07",
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: "paid",
    date: "2023-08-19",
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: "paid",
    date: "2023-06-03",
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: "paid",
    date: "2022-06-05",
  },
];

async function seedUsers() {
  console.log("👤 Seeding users...");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
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
        return sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );

    console.log(`   ✅ Seeded ${insertedUsers.length} users`);
    return insertedUsers;
  } catch (error) {
    console.error("   ❌ Error seeding users:", error.message);
    throw error;
  }
}

async function seedCustomers() {
  console.log("🏢 Seeding customers...");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`   ✅ Seeded ${insertedCustomers.length} customers`);
    return insertedCustomers;
  } catch (error) {
    console.error("   ❌ Error seeding customers:", error.message);
    throw error;
  }
}

async function seedInvoices() {
  console.log("🧾 Seeding invoices...");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
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
        (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`   ✅ Seeded ${insertedInvoices.length} invoices`);
    return insertedInvoices;
  } catch (error) {
    console.error("   ❌ Error seeding invoices:", error.message);
    throw error;
  }
}

async function seedRevenue() {
  console.log("💰 Seeding revenue...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`   ✅ Seeded ${insertedRevenue.length} revenue records`);
    return insertedRevenue;
  } catch (error) {
    console.error("   ❌ Error seeding revenue:", error.message);
    throw error;
  }
}

async function main() {
  const startTime = Date.now();

  try {
    console.log("🔌 Connecting to database...");
    console.log("   (This may take 10-30 seconds if database is suspended)");
    console.log("");

    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("");
    console.log(`🎉 Database seeded successfully in ${duration}s!`);
    console.log("");
    console.log("✅ Next steps:");
    console.log("   1. Test locally: http://localhost:3000/query");
    console.log("   2. Or deploy to Vercel and test there");
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("");
    console.log(`❌ Seeding failed after ${duration}s`);
    console.log("");

    if (error.code === "ETIMEDOUT" || error.message?.includes("ETIMEDOUT")) {
      console.log("⚠️  Database connection timeout!");
      console.log("");
      console.log(
        "This usually means the Neon database is suspended (free tier).",
      );
      console.log("The database needs 5-10 seconds to wake up.");
      console.log("");
      console.log("💡 Solution: Wait 30 seconds and run this command again:");
      console.log("   pnpm seed:cli");
      console.log("");
    } else {
      console.error("Error details:", error);
    }

    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
