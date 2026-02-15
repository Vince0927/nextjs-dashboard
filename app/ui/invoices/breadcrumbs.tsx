import { clsx } from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, "flex text-xl md:text-2xl")}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? "text-gray-900" : "text-gray-500",
            )}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/*

Based on the code in app/ui/invoices/breadcrumbs.tsx, here is an explanation of what the component does.

Purpose
The Breadcrumbs component is a secondary navigation aid. It shows the user their current location within the application's hierarchy (e.g., Invoices / Create Invoice) and allows them to easily navigate back to previous levels.

How it Works
Props (breadcrumbs): It accepts an array of objects, where each object represents a step in the path:

label: The text to display (e.g., "Invoices").
href: The URL to navigate to (e.g., /dashboard/invoices).
active: A boolean indicating if this is the current page.
Rendering Logic:

It loops through the breadcrumbs array.
It renders a Link for every item.
It adds a separator (/) after every item except the last one.
Styling & Accessibility:

Active State: It uses clsx to change the text color. If active is true, the text is darker (text-gray-900); otherwise, it is lighter (text-gray-500).
Fonts: It applies the lusitana font class to match the dashboard's branding.
Accessibility: It uses aria-label="Breadcrumb" on the nav and aria-current on the active list item to help screen readers understand the structure.
Example Usage
In your app/dashboard/invoices/create/page.tsx, it is used to show the path to the "Create Invoice" page:


<Breadcrumbs
  breadcrumbs={[
    { label: 'Invoices2', href: '/dashboard/invoices' },
    {
      label: 'Create Invoice2',
      href: '/dashboard/invoices/create',
      active: true, // Highlights this text
    },
  ]}
/>


*/
