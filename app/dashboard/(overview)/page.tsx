import CardWrapper from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";

import { Suspense } from "react";

import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

import {
  users,
  customers,
  invoices,
  revenue,
  appSettings,
  categories,
} from "@/app/lib/placeholder-data";

//import from data file -> revenue-chart2 ->page.tsx
import { RevenueChart2 } from "@/app/ui/dashboard/revenue-chart2";

// This is an async Server Component. It allows us to fetch data directly
// on the server, but we delegate the specific fetching to child components.
export default async function Page() {
  return (
    <main>
      {/*  The Lusitana font is applied to the entire dashboard heading and content below it. */}

      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        <b>Dashboard</b>
        <p>-----------------------------------------</p>
        <p>{users[0].name}</p>
        <p>{users[0].email}</p>
        <p>-----------------------------------------</p>
        {/* loop through every customer name */}
        {customers.map((customer) => (
          <p key={customer.id}>{customer.image_url}</p>
        ))}
        <p>-----------------------------------------</p>
        {/* loop through every invoice customer id */}
        {invoices.map((invoice) => (
          <p key={invoice.customer_id}>{invoice.customer_id}</p>
        ))}
        <p>-----------------------------------------</p>
        {/* loop through all revenue data */}
        {revenue.map((rev) => (
          <p key={rev.month}>
            {" "}
            {rev.month}: {rev.revenue}{" "}
          </p>
        ))}
        <p>-----------------------------------------</p>
        {appSettings.theme} {appSettings.max_items_per_page}
        <p>-----------------------------------------</p>
        {/* loop through categories and nested subcategories */}
        {categories.map((category) => (
          <div key={category.id}>
            {category.subcategories.map((sub) => (
              <p key={sub.id}>{sub.name}</p>
            ))}
          </div>
        ))}
        <p>-----------------------------------------</p>
        {/* Filter for Phones */}
        {categories.map((category) => (
          <div key={category.id}>
            {category.subcategories
              .filter((sub) => sub.name === "Phones")
              .map((sub) => (
                <p key={sub.id}>{sub.name}</p>
              ))}
          </div>
        ))}
        <p>-----------------------------------------</p>
        <RevenueChart2 />
        <p>-----------------------------------------</p>
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Suspense allows the CardWrapper to load asynchronously.
            While it's loading, the CardsSkeleton is shown. */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* RevenueChart has an artificial delay in data.ts.
            Suspense ensures the rest of the page is visible while this chart loads. */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        {/* LatestInvoices fetches its own data independently.
            This prevents a slow data fetch in one component from blocking the whole page. */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
