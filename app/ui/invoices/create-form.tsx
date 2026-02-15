// ============================================================================
// CREATE INVOICE FORM - Client Component for creating new invoices
// ============================================================================
// This is a CLIENT COMPONENT (marked with 'use client') because it uses:
// - React hooks (useActionState)
// - Interactive form elements
// - Client-side state management
//
// The form uses progressive enhancement - it works without JavaScript!
// When JavaScript is available, it provides real-time validation feedback.
"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import { CustomerField } from "@/app/lib/definitions"; // TypeScript type for customer data
import Link from "next/link"; // Next.js Link component for client-side navigation
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"; // Icon components from Heroicons
import { Button } from "@/app/ui/button"; // Reusable button component
import { createInvoice, State } from "@/app/lib/actions"; // Server Action and State type
import { useActionState } from "react"; // React 19 hook for managing form state with Server Actions

// ============================================================================
// FORM COMPONENT
// ============================================================================
// This component renders a form for creating a new invoice.
// It receives a list of customers as props to populate the dropdown.
//
// Props:
//   - customers: Array of customer objects with id and name
export default function Form({ customers }: { customers: CustomerField[] }) {
  // ============================================================================
  // STATE MANAGEMENT WITH useActionState
  // ============================================================================
  // useActionState is a React 19 hook that manages form state with Server Actions
  // It replaces the deprecated useFormState from react-dom
  //
  // Parameters:
  //   1. createInvoice - The Server Action to call when form is submitted
  //   2. initialState - The initial state object
  //
  // Returns:
  //   - state: Current state object (contains errors and messages)
  //   - dispatch: Function to pass to form's action prop
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createInvoice, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* ================================================================
            CUSTOMER SELECTION FIELD
            ================================================================ */}
        <div className="mb-4">
          {/* Label for accessibility */}
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer2
          </label>

          <div className="relative">
            {/* Customer dropdown select
                - name="customerId" matches the field name in our Zod schema
                - defaultValue="" ensures no customer is pre-selected
                - aria-describedby links to error message for screen readers */}
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              {/* Disabled placeholder option */}
              <option value="" disabled>
                Select a customer2
              </option>

              {/* Map through customers array to create options */}
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            {/* Icon positioned absolutely inside the select */}
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          {/* Error message container
              - aria-live="polite" announces changes to screen readers
              - aria-atomic="true" reads the entire region when it changes */}
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {/* Display validation errors from Zod if they exist */}
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* ================================================================
            AMOUNT INPUT FIELD
            ================================================================ */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount2
          </label>

          <div className="relative mt-2 rounded-md">
            <div className="relative">
              {/* Amount input
                  - type="number" provides numeric keyboard on mobile
                  - step="0.01" allows decimal values (cents)
                  - name="amount" matches the field name in our Zod schema */}
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />

              {/* Dollar icon that changes color when input is focused
                  - peer-focus: targets this element when the input (peer) is focused */}
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Error message container for amount validation errors */}
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* ================================================================
            STATUS RADIO BUTTONS
            ================================================================ */}
        <fieldset>
          {/* Legend acts as a label for the entire fieldset */}
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status2
          </legend>

          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              {/* PENDING option */}
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending2 <ClockIcon className="h-4 w-4" />
                </label>
              </div>

              {/* PAID option */}
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid2 <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>

          {/* Error message container for status validation errors */}
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {/* ================================================================
            GENERAL ERROR MESSAGE
            ================================================================
            Displays general error messages (not field-specific) */}
        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>

      {/* ================================================================
          FORM ACTIONS (Cancel and Submit buttons)
          ================================================================ */}
      <div className="mt-6 flex justify-end gap-4">
        {/* Cancel button - navigates back to invoices list */}
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel2
        </Link>

        {/* Submit button - triggers form submission
            The form's action={dispatch} will call the createInvoice Server Action */}
        <Button type="submit">Create Invoice2</Button>
      </div>
    </form>
  );
}
