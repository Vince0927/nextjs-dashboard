// ============================================================================
// SERVER ACTIONS - Functions that run on the server to mutate data
// ============================================================================
// The 'use server' directive marks this file as containing Server Actions.
// Server Actions are asynchronous functions that execute on the server and can
// be called directly from Client or Server Components without creating API routes.
"use server";

// ============================================================================
// IMPORTS
// ============================================================================
import { z } from "zod"; // Zod: TypeScript-first schema validation library
import postgres from "postgres"; // PostgreSQL client for Node.js
import { revalidatePath } from "next/cache"; // Next.js function to revalidate cached data
import { redirect } from "next/navigation"; // Next.js function to redirect users
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// ============================================================================
// AUTHENTICATE - Server Action for user login
// ============================================================================
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// ============================================================================
// DATABASE CONNECTION SETUP
// ============================================================================
// Detect if we're connecting to a local database (localhost or 127.0.0.1)
// This is important because local databases don't need SSL encryption
const isLocal =
  process.env.POSTGRES_HOST === "localhost" ||
  process.env.POSTGRES_HOST === "127.0.0.1";

// Create a PostgreSQL connection using environment variables
// The connection is configured differently for local vs remote databases
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: isLocal ? false : "require", // Disable SSL for local, require for remote (like Vercel Postgres)
  connect_timeout: 5, // Maximum time to wait for connection (5 seconds)
  idle_timeout: 0, // Keep connections alive indefinitely when idle
  max_lifetime: 0, // Keep connections alive indefinitely
  max: 1, // Maximum number of connections in the pool
});

// ============================================================================
// VALIDATION SCHEMAS USING ZOD
// ============================================================================
// Define the shape of our invoice form data with validation rules
// Zod will automatically validate data and provide type-safe error messages
const FormSchema = z.object({
  id: z.string(), // Invoice ID (UUID string)
  customerId: z.string({
    invalid_type_error: "Please select a customer.", // Error message if not a string
  }),
  amount: z.coerce // .coerce converts string input to number
    .number() // Must be a number
    .gt(0, { message: "Please enter an amount greater than $0." }), // Must be greater than 0
  status: z.enum(["pending", "paid"], {
    // Must be exactly "pending" or "paid"
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(), // Date in ISO format (YYYY-MM-DD)
});

// Create specialized schemas for different operations:
// CreateInvoice: Omit 'id' (auto-generated) and 'date' (set by server)
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// UpdateInvoice: Omit 'id' (passed separately) and 'date' (don't update date)
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// Define the shape of the state object returned by Server Actions
// This is used by useActionState hook to manage form state
export type State = {
  errors?: {
    // Optional field-specific validation errors
    customerId?: string[]; // Array of error messages for customer field
    amount?: string[]; // Array of error messages for amount field
    status?: string[]; // Array of error messages for status field
  };
  message: string | null; // General error or success message
};

// ============================================================================
// CREATE INVOICE - Server Action to create a new invoice
// ============================================================================
// This function is called when the user submits the "Create Invoice" form.
// It validates the form data, inserts a new invoice into the database,
// revalidates the cache, and redirects the user back to the invoices page.
//
// Parameters:
//   - prevState: Previous state from useActionState (required by the hook signature, but not used here)
//   - formData: Form data submitted by the user (contains customerId, amount, status)
//
// Returns: State object with errors or success message
export async function createInvoice(prevState: State, formData: FormData) {
  // Step 1: VALIDATE FORM DATA
  // Use Zod's safeParse to validate the form data against our schema
  // safeParse returns { success: true, data: ... } or { success: false, error: ... }
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"), // Get customer ID from form
    amount: formData.get("amount"), // Get amount from form (will be coerced to number)
    status: formData.get("status"), // Get status from form ("pending" or "paid")
  });

  // If validation fails, return the errors to display in the form
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors, // Extract field-specific errors
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Step 2: PREPARE DATA FOR DATABASE
  // Extract validated data (TypeScript now knows the exact types!)
  const { customerId, amount, status } = validatedFields.data;

  // Convert amount from dollars to cents to avoid floating-point errors
  // Example: $100.50 becomes 10050 cents
  const amountInCents = amount * 100;

  // Generate current date in YYYY-MM-DD format
  // Example: "2024-01-15"
  const date = new Date().toISOString().split("T")[0];

  // Step 3: INSERT INTO DATABASE
  try {
    // Use SQL template literal to safely insert data (prevents SQL injection)
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If database operation fails, log the error and return error message
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Step 4: REVALIDATE CACHE
  // Tell Next.js to refresh the cached data for the invoices page
  // This ensures the new invoice appears immediately in the list
  revalidatePath("/dashboard/invoices");

  // Step 5: REDIRECT
  // Redirect the user back to the invoices page
  // Note: redirect() throws an error internally, so code after this won't run
  redirect("/dashboard/invoices");
}

// ============================================================================
// UPDATE INVOICE - Server Action to update an existing invoice
// ============================================================================
// This function is called when the user submits the "Edit Invoice" form.
// It validates the form data, updates the invoice in the database,
// revalidates the cache, and redirects the user back to the invoices page.
//
// Parameters:
//   - id: Invoice ID to update (bound using .bind() in the form component)
//   - prevState: Previous state from useActionState (required by the hook signature, but not used here)
//   - formData: Form data submitted by the user (contains customerId, amount, status)
//
// Returns: State object with errors or success message
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // Step 1: VALIDATE FORM DATA
  // Use Zod's safeParse to validate the form data against our schema
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"), // Get customer ID from form
    amount: formData.get("amount"), // Get amount from form (will be coerced to number)
    status: formData.get("status"), // Get status from form ("pending" or "paid")
  });

  // If validation fails, return the errors to display in the form
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors, // Extract field-specific errors
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  // Step 2: PREPARE DATA FOR DATABASE
  // Extract validated data
  const { customerId, amount, status } = validatedFields.data;

  // Convert amount from dollars to cents
  const amountInCents = amount * 100;

  // Step 3: UPDATE DATABASE
  try {
    // Use SQL template literal to safely update data
    // Note: We don't update the 'date' field - it stays as the original creation date
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // If database operation fails, log the error and return error message
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Update Invoice." };
  }

  // Step 4: REVALIDATE CACHE
  // Tell Next.js to refresh the cached data for the invoices page
  revalidatePath("/dashboard/invoices");

  // Step 5: REDIRECT
  // Redirect the user back to the invoices page
  redirect("/dashboard/invoices");
}

// ============================================================================
// DELETE INVOICE - Server Action to delete an invoice
// ============================================================================
// This function is called when the user clicks the "Delete" button.
// It deletes the invoice from the database and revalidates the cache.
//
// Note: This function THROWS an error instead of returning it because
// it's called from a form action that doesn't use useActionState.
//
// Parameters:
//   - id: Invoice ID to delete
//
// Returns: Nothing (void) - throws error on failure
export async function deleteInvoice(id: string) {
  try {
    // Step 1: DELETE FROM DATABASE
    // Use SQL template literal to safely delete the invoice
    await sql`DELETE FROM invoices WHERE id = ${id}`;

    // Step 2: REVALIDATE CACHE
    // Tell Next.js to refresh the cached data for the invoices page
    // This ensures the deleted invoice disappears immediately from the list
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    // If database operation fails, log the error and throw
    // The error will be caught by Next.js error boundary
    console.error("Database Error:", error);
    throw new Error("Database Error: Failed to Delete Invoice.");
  }
}
