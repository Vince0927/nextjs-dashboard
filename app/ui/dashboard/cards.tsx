import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  // Fetch data for all cards at once.
  // This wrapper allows us to use a single Suspense boundary for the whole group
  // instead of having them pop in one by one.
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Collected2" value={totalPaidInvoices} type="collected" />
      <Card title="Pending2" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices2" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers2"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

/*

Based on the code in app/ui/dashboard/cards.tsx, here is a detailed explanation of how the file works.

This file is responsible for displaying the four summary cards at the top of your dashboard (Collected, Pending, Total Invoices, and Total Customers). It uses a pattern called Component Composition to separate data fetching from UI rendering.

1. The CardWrapper Component (Data Fetching)
This is the default export and the main entry point. It is a React Server Component, indicated by the async keyword.

typescriptreact
export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  
  // ... returns 4 <Card /> components
}
Server-Side Fetching: Because it is async, it can fetch data directly from the database.
fetchCardData(): It calls this function (imported from app/lib/data.ts). If you look at data.ts, this function uses Promise.all to run three SQL queries in parallel (counting invoices, counting customers, and summing statuses). This is efficient because it gets all the numbers needed for all four cards in one go, rather than making the database wait for four separate requests.
Suspense Boundary: In your page.tsx, this component is wrapped in <Suspense fallback={<CardsSkeleton />}>. This means while CardWrapper is waiting for fetchCardData() to finish, the user sees a loading skeleton. Once the data arrives, all four cards pop in simultaneously.
2. The Card Component (UI Rendering)
This is a presentational component. It doesn't know about the database; it just takes data passed to it and makes it look good.

typescriptreact
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
Props: It accepts title (the label), value (the number/amount), and type (which determines the icon).
Dynamic Icons: It uses the type prop to look up the correct icon from the iconMap object.
Styling: It applies Tailwind CSS classes for layout and uses the lusitana font for the number to match the design system.
3. The iconMap Object
This is a simple JavaScript object defined at the top of the file.

typescriptreact
const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};
Purpose: It maps a string key (like "collected") to a React Component (like BanknotesIcon).
Usage: Inside the Card component, const Icon = iconMap[type] selects the correct icon component so it can be rendered as <Icon />.
Summary of Flow
Page Load: page.tsx tries to render <CardWrapper />.
Suspense: React sees CardWrapper is async, so it shows <CardsSkeleton /> immediately.
Data Fetch: CardWrapper calls fetchCardData() and waits for the database.
Render: Once data returns, CardWrapper renders four <Card /> components, passing the specific numbers to each.
Display: The Skeleton disappears, and the user sees the four summary cards with the correct icons and numbers.


*/
