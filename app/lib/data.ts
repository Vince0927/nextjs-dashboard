// ============================================================================
// DATA FETCHING - Functions to retrieve data from the database
// ============================================================================
import postgres from "postgres";

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================
// Create a connection with proper configuration for local PostgreSQL
const isLocal =
  process.env.POSTGRES_HOST === "localhost" ||
  process.env.POSTGRES_HOST === "127.0.0.1";
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: isLocal ? false : "require",
  connect_timeout: 5,
  idle_timeout: 0,
  max_lifetime: 0,
  max: 1,
});

// ============================================================================
// FETCH REVENUE
// ============================================================================
// Fetches revenue data for the chart.
// Includes an artificial delay to demonstrate streaming.
export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log("Fetching revenue data...");

    //simulate a 3 second delay for fetching data from the database. Adjust as needed for testing.
    await new Promise((resolve) => setTimeout(resolve, 3000)); //not needed in production, just for testing Suspense and loading states.
    //filter for all months
    //const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    //filter for month of december only
    //const data = await sql<Revenue[]>`SELECT * FROM revenue WHERE month = 'Dec'`;
    //filter for months of jan to march only
    const data = await sql<
      Revenue[]
    >`SELECT * FROM revenue WHERE month IN ('Jan', 'Feb', '13th', 'Mar')`;

    console.log(
      "Data fetch completed after 3 seconds. This is for testing only",
    );

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

// ============================================================================
// FETCH LATEST INVOICES
// ============================================================================
// Fetches the last 5 invoices, sorted by date, to display in the dashboard.
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    // Format the amount from cents to dollars and add a currency symbol for display.
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

// ============================================================================
// FETCH CARD DATA
// ============================================================================
// Fetches aggregated data (counts, totals) for the dashboard cards.
// Uses Promise.all to run queries in parallel for better performance.
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;
    // Wait for all queries to complete before proceeding.
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // Extract and format the results for the cards. Handle potential null values with defaults.
    const numberOfInvoices = Number(data[0][0].count ?? "0");
    const numberOfCustomers = Number(data[1][0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

// ============================================================================
// FETCH FILTERED INVOICES
// ============================================================================
const ITEMS_PER_PAGE = 6;
// Fetches a paginated list of invoices matching the search query.
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

// ============================================================================
// FETCH INVOICES PAGES
// ============================================================================
// Calculates the total number of pages based on the search query.
export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

// ============================================================================
// FETCH INVOICE BY ID
// ============================================================================
// Fetches a specific invoice for the Edit form.
export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

// ============================================================================
// FETCH CUSTOMERS
// ============================================================================
// Fetches all customers for the dropdown in the Create/Edit forms.
export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

// ============================================================================
// FETCH FILTERED CUSTOMERS
// ============================================================================
// Fetches customer data with aggregated invoice stats for the Customers page.
export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

//testing fetching of new revenue record for the 13th month
export async function fetchRevenue2() {
  try {
    await new Promise((res) => setTimeout(res, 3000)); //delay
    const data = await sql<
      Revenue[]
    >`SELECT * FROM revenue WHERE month = '13th'`;

    console.log("Fetched revenue data for the 13th month!");
    return data;
  } catch (error) {
    console.error(error);
  }
}
