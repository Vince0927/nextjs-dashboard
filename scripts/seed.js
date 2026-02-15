const { config } = require("dotenv");
const postgres = require("postgres");
const bcrypt = require("bcryptjs");

// Load environment variables
config({ path: ".env" });

// Placeholder data (copied from placeholder-data.ts)
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

//revenue data for the past 12 months (Jan to Dec)
const revenue = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
  { month: "13th", revenue: 5000 }, // New revenue record added for testing
];

const isLocal =
  process.env.POSTGRES_HOST === "localhost" ||
  process.env.POSTGRES_HOST === "127.0.0.1";

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: isLocal ? false : "require",
});

async function seedUsers() {
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

    console.log(`✅ Seeded ${insertedUsers.length} users`);
    return insertedUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

async function seedCustomers() {
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

    console.log(`✅ Seeded ${insertedCustomers.length} customers`);
    return insertedCustomers;
  } catch (error) {
    console.error("❌ Error seeding customers:", error);
    throw error;
  }
}

async function seedInvoices() {
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

    console.log(`✅ Seeded ${insertedInvoices.length} invoices`);
    return insertedInvoices;
  } catch (error) {
    console.error("❌ Error seeding invoices:", error);
    throw error;
  }
}

//seeding revenue data
async function seedRevenue() {
  try {
    //// 1. Create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;
    //// 2. Insert data from the 'revenue' array
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => sql`
          INSERT INTO revenue (month, revenue)
          VALUES (${rev.month}, ${rev.revenue})
          ON CONFLICT (month) DO NOTHING;
        `,
      ),
    );

    console.log(`✅ Seeded ${insertedRevenue.length} revenue records`);
    return insertedRevenue;
  } catch (error) {
    console.error("❌ Error seeding revenue:", error);
    throw error;
  }
}

// Main function to run all seeders
async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

main();

/*


How Revenue Data is Seeded
The seeding process for revenue happens in the seedRevenue function. Here is the breakdown of the logic:

Table Creation: It first ensures the revenue table exists in your database using CREATE TABLE IF NOT EXISTS. It sets the month column as a unique identifier.
Data Insertion: It iterates over the revenue array (defined at the top of the file) and runs an INSERT query for each record.
Conflict Handling: It uses ON CONFLICT (month) DO NOTHING to prevent errors if you run the script multiple times. If data for that month already exists, it skips it.




How to Run the Script
To run this script, you need to execute it using Node.js from your terminal.

Ensure Environment Variables are Set: Make sure you have a .env file in your project root with a valid POSTGRES_URL.
Open Terminal: Navigate to the root directory of your project (nextjs-dashboard).
Run Command:
bash
node scripts/seed.js
This will execute the main() function in the file, which calls seedRevenue() along with the other seeding functions.





ADDING A NEW DATA ON REVENUE AND ON CONFLICT USER


To add new data to the revenue table without breaking the code, you need to modify the revenue array in scripts/seed.js.

However, there is a critical issue in your seedUsers function: it lacks an ON CONFLICT clause. If you try to run the seed script again to add your new revenue data, the script will crash because it tries to insert the user again. I have included a fix for this in the diff below so you can re-run the script safely.

Here are the steps:

Add the new data object to the revenue array.
Note: The month column is defined as VARCHAR(4), so your month label must be 4 characters or less (e.g., "Jan", "Test", "13th").
Fix the seedUsers function to handle existing users gracefully (preventing the "breaking" of the code).
Code Changes
seed.js
-1
+3
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
  { month: "13th", revenue: 5000 },
];

const isLocal =
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword});
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );
How to Run It
After saving the changes, run the seed script in your terminal:

bash
node scripts/seed.js
This will insert the new revenue record. Existing records will be skipped thanks to the ON CONFLICT clauses.








*/
