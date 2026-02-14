// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
import { Revenue } from "./definitions";

//users
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

//customers
const customers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Good Rabbit",
    email: "good@rabbit.com",
    image_url: "/customers/good-rabbit.png",
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

//invoices
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

//revenue data for the last 12 months
const revenue: Revenue[] = [
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
];


const appSettings = {
  "theme": "dark",
  "currency": "USD",
  "max_items_per_page": 10
};


const categories = [
  {
    id: 1,
    name: "Electronics",
    subcategories: [
      { id: 2, name: "Phones" },
      { id: 3, name: "Laptops" }
    ]
  }
];



export { users, customers, invoices, revenue, appSettings, categories };

/*

Based on the context of your placeholder-data.ts file and general 
database practices, here are the different types of data structures 
commonly used as placeholder data to seed databases:

1. Arrays of Objects (Document/Row based)
This is the structure currently used in your placeholder-data.ts file. It is the most common way to represent seed data in JavaScript/TypeScript applications because it maps easily to both SQL rows and NoSQL documents.

Structure: A list [] containing objects {}.
Example from your code:
typescript
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];
Database Mapping:
SQL: Each object becomes a Row, keys become Columns.
NoSQL (e.g., MongoDB): Each object becomes a Document.



2. Relational Data (Normalized)
This isn't a specific "file format" but a structural concept. Your placeholder data implements this by using IDs to reference other arrays.

Structure: Separate arrays where one array references the primary key (ID) of another.
Example from your code: The invoices array uses customer_id to point to a specific customer in the customers array.
typescript
const invoices = [
  {
    customer_id: customers[0].id, // Relational link
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  },
];



3. Time-Series Data
This structure is optimized for data points indexed by time intervals.

Structure: A sequence of values paired with timestamps or time labels.
Example from your code: Your revenue array is a perfect example of time-series placeholder data.
typescript


const revenue = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  // ...
];


4. Key-Value Pairs
Often used for configuration settings, caching, or simple lookups (like Redis or Dictionary tables).

Structure: A simple map of unique keys to specific values.
Example:
typescript
const appSettings = {
  "theme": "dark",
  "currency": "USD",
  "max_items_per_page": 10
};



5. Hierarchical / Tree Structures (Nested JSON)
Used when data has a parent-child relationship that is best stored together, often used in NoSQL databases or JSONB columns in Postgres.

Structure: Objects containing other objects or arrays of objects.
Example:
typescript
const categories = [
  {
    id: 1,
    name: "Electronics",
    subcategories: [
      { id: 2, name: "Phones" },
      { id: 3, name: "Laptops" }
    ]
  }
];


6. Graph Data (Nodes and Edges)
Used for representing complex relationships, like social networks.

Structure: Nodes (entities) and Edges (relationships between them).
Example:
typescript
const follows = [
  { source: "user_a_id", target: "user_b_id" },
  { source: "user_b_id", target: "user_c_id" }
];

*/
