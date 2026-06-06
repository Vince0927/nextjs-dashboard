>>>>>>>>>>>>>>>>>>>>
1. Creating a new project
>>>>>>>>>>>>>>>>>>>>

>>>>>>>>>>>>>>>>>>>>
npm install -g pnpm
>>>>>>>>>>>>>>>>>>>>

cd to the folder you want to create the project

npx create-next-app@latest your-project-name

current project:
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm



EXPLORING THE PROJECT STRUCTURE

cd nextjs-dashboard

/app then /lib and /ui 


/app: Contains all the routes, components, and logic for your application, this is where you'll be mostly working from.

/app/lib: Contains functions used in your application, such as reusable utility functions and data fetching functions.

/app/ui: Contains all the UI components for your application, such as cards, tables, and forms. To save time, we've pre-styled these components for you.

/public: Contains all the static assets for your application, such as images.

PLACEHOLDER DATA 
- For this project, we've provided some placeholder data in app/lib/placeholder-data.ts. Each JavaScript object in the file represents a table in your database
- Use placeholder data in JSON format or as JavaScript objects.

app/lib/placeholder-data.ts


TYPESCRIPT 
- For now, take a look at the /app/lib/definitions.ts file. Here, we manually define the types that will be returned from the database.
- By using TypeScript, you can ensure you don't accidentally pass the wrong data format to your components or database, like passing a string instead of a number to invoice amount.

/app/lib/definitions.ts






>>>>>>>>>>>>>>>>>>>>
RUNNING THE DEV SERVER
>>>>>>>>>>>>>>>>>>>>

pnpm i
pnpm dev


NOTE: Every folder contains page.tsx which is a page. Nextjs starts at static pages ex. /app folder 
has page.tsx that contains the main home page with several interactive components

>>>>>>>>>>>>>>>>>>>>
2. CSS STYLING
>>>>>>>>>>>>>>>>>>>>

app\layout.tsx

app\ui\global.css - root css layout

You can use this file to add CSS rules to all the routes in your application - such as CSS reset rules, site-wide styles for HTML elements like links, and more.

If you take a look inside global.css, you'll notice some @tailwind directives:

@tailwind base;
@tailwind components;
@tailwind utilities;

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
3. OPTIMIZING FONTS AND IMAGES
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

next/font
next/image

Create a fonts.ts from UI to serve as global fonts to layout.tsx

add the primary and secondary fonts and import to other pages

app\ui\fonts.ts - store fonts from google
app\layout.tsx - import to layout as global font
app\page.tsx - import to app's page.tsx as secondary font on <p> element


Next.js can serve static assets, like images, under the top-level /public folder. Files inside /public can be referenced in your application.


<Image> Component - automatic image optimization

in your /app/page.tsx,

import Image from 'next/image';

      {/* For desktop standard */}
          <Image
            src="/hero-desktop.png" //from public folder
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />

          {/* For mobile standard */}
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          />



Here, you're setting the width to 1000 and height to 760 pixels. It's good practice to set the width and height of your images to avoid layout shift, these should be an aspect ratio identical to the source image.  These values are not the size the image is rendered, but instead the size of the actual image file used to understand the aspect ratio.

You'll also notice the class hidden to remove the image from the DOM on mobile screens, and md:block to show the image on desktop screens.


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
4. CREATING LAYOUT AND PAGES
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Create the dashboard routes using file-system routing.

Understand the role of folders and files when creating new route segments.

Create a nested layout that can be shared between multiple dashboard pages.

Understand what colocation, partial rendering, and the root layout are.


Next.js uses file-system routing where folders are used to create nested routes. Each folder represents a route segment that maps to a URL segment.

ex. 

https://sample.com/dashboard/customers 

/ - app (root segment)
dashboard - under app/dashboard (segment)
customers - under app/dashboard/customers (leaf segment)

You can create separate UIs for each route using layout.tsx and page.tsx files.


page.tsx is a special Next.js file that exports a React component, and it's required for the route to be accessible. In your application, you already have a page file: /app/page.tsx - this is the home page associated with the route /.

Ex.

http://localhost:3000/test-customers
http://localhost:3000/test-route

export default function Page(){
    return(
        <>
            <h1>Test this route from a folder with a page.tsx</h1>
        </>
    )
}


After adding more pages inside the dashboard ex. customers, invoices etc. we create the layout.tsx
that can be shared with these pages

/app/dashboard/layout.tsx

// app/dashboard/layout.tsx for side nav and page layout
//this is the layout for the dashboard section of the app.
//  It wraps all pages under /dashboard and provides a 
// consistent layout with a side navigation and main content area.

import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}


ROOT LAYOUT

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}


This is called a root layout and is required in every Next.js application. Any UI you add to the root layout will be shared across all pages in your application. 

Since the new layout you've just created (/app/dashboard/layout.tsx) is unique to the dashboard pages, you don't need to add any UI to the root layout above.


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
5. NAVIGATING BETWEEN PAGES
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

use the next/link component
active link with the usePathname() hook.

In Next.js, you can use the <Link /> Component to link between pages in your application. <Link> allows you to do client-side navigation with JavaScript.


To use the <Link /> component, open /app/ui/dashboard/nav-links.tsx, and import the Link component from next/link. Then, replace the <a> tag with <Link>:



Basic route sample to /login from /test-route:


import Link from 'next/link'

export default function Page(){
    return(
        <>
            <h1>Test this route from a folder with a page.tsx</h1>
            <Link href='/login'>
                <p>Go to sign in</p>
                <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">Login</button>
            </Link>
            
        </>
    )
}






app\ui\dashboard\nav-links.tsx

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
 
// ...
 
export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}


As you can see, the Link component is similar to using <a> tags, but instead of <a href="…">, you use <Link href="…">.

Splitting and prefetching the pages
-If a page has error other page will still work 
-Automatic prefetch of the page on the background



SHOWING ACTIVE LINKS

Next.js provides a hook called usePathname() that you can use to check the path and implement this pattern.

usePathname() hook


Add React's "use client" directive to the top of the file, then import usePathname() from next/navigation:

from, 

/app/ui/dashboard/nav-links.tsx


add:

"use client"

import { usePathname } from 'next/navigation';
import clsx from 'clsx';


inside the function use the hook,

 const pathname = usePathname();

then inside the link, use the pathname and cslx styling like this,

...

 <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >



>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
6. SETTING UP YOUR DATABASE
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Create .env.local or .env in the same directory with the /app
then configure it like below:

POSTGRES_URL=postgres://postgres:Postgres143!@localhost:5432/neondb
POSTGRES_URL_NON_POOLING=postgres://postgres:Postgres143!@localhost:5432/neondb
POSTGRES_HOST=localhost
AUTH_SECRET=992527115eebd08d779bc43a27686c0def29dc5db895bea92139756c51c68ce5

SEED YOUR DATABASE

The script uses SQL to create the tables, and the data from app\lib\placeholder-data.ts file to populate them after they've been created.

Ensure your local development server is running with pnpm run dev and navigate to localhost:3000/seed in your browser. When finished, you will see a message "Database seeded successfully" in the browser

QUERY DATABASE

app\query\route.ts

Uncomment the file, remove the Response.json() block, and navigate to localhost:3000/query in your browser. You should see that an invoice amount and name is returned.

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
7. FETCHING DATA
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

API LAYER

APIs are an intermediary layer between your application code and database. There are a few cases where you might use an API:

If you're using third-party services that provide an API.
If you're fetching data from the client, you want to have an API layer that runs on the server to avoid exposing your database secrets to the client.



DATABASE QUERIES

 For relational databases like Postgres, you can do this with SQL or with an ORM

 There are a few cases where you have to write database queries:

1.When creating your API endpoints, you need to write logic to interact with your database.
2.If you are using React Server Components (fetching data on the server), you can skip the API layer, and query your database directly without risking exposing your database secrets to the client.

SERVER COMPONENTS

By default, Next.js applications use React Server Components.

- You can use async/await syntax without needing useEffect, useState or other data fetching libraries.

- Server Components run on the server, so you can keep expensive data fetches and logic on the server, only sending the result to the client

- Since Server Components run on the server, you can query the database directly without an additional API layer. This saves you from writing and maintaining additional code.



USING SQL


SQL is the industry standard for querying relational databases (e.g. ORMs generate SQL under the hood).
Having a basic understanding of SQL can help you understand the fundamentals of relational databases, allowing you to apply your knowledge to other tools.
SQL is versatile, allowing you to fetch and manipulate specific data.
The postgres.js library provides protection against SQL injections


Go to /app/lib/data.ts. Here you'll see that we're using postgres. The sql function allows you to query your database:

import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// ...


// This is an async Server Component. It allows us to fetch data directly
// on the server, but we delegate the specific fetching to child components.

The page is an async server component. This allows you to use await to fetch data.
There are also 3 components which receive data: <Card>, <RevenueChart>, and <LatestInvoices>. They are currently commented out and not yet implemented.


app\dashboard\(overview)\page.tsx

export default async function Page() {
  return (
    ...




To fetch data for the <RevenueChart/> component, import the fetchRevenue function from data.ts and call it inside your component:


import { fetchRevenue } from '@/app/lib/data';



For the <LatestInvoices /> component, we need to get the latest 5 invoices, sorted by date.

/app/lib/data.ts

// Fetch the last 5 invoices, sorted by date
const data = await sql<LatestInvoiceRaw[]>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;


In your page, import the fetchLatestInvoices function:

  import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';


export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // ...
}



A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests.


PARALLEL DATA FETCHING

A common way to avoid waterfalls is to initiate all data requests at the same time - in parallel.


In JavaScript, you can use the Promise.all() or Promise.allSettled() functions to initiate all promises at the same time. For example, in data.ts, we're using Promise.all() in the fetchCardData() function:

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;
 
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // ...
  }
}


By using this pattern, you can:

Start executing all data fetches at the same time, which is faster than waiting for each request to complete in a waterfall.
Use a native JavaScript pattern that can be applied to any library or framework.
However, there is one disadvantage of relying only on this JavaScript pattern: what happens if one data request is slower than all the others? Let's find out more in the next chapter.


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
8. STATIC AND DYNAMIC RENDERING
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Static rendering - faster load time. Cached pages so it's useful for page that doesn't often access data
Dynamic rendering - opposite of static rendering. Useful for frequently accessed data
With dynamic rendering, your application is only as fast as your slowest data fetch

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
9. STREAMING
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.

There are two ways you implement streaming in Next.js:

At the page level, with the loading.tsx file (which creates <Suspense> for you).
At the component level, with <Suspense> for more granular control.

In the /app/dashboard folder, create a new file called loading.tsx:

export default function Loading() {
  return <div>Loading...</div>;
}


loading.tsx - special Next.js file  serves as a fallback UI while the content loads

from the dashboard,

Since <SideNav> is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading.

The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation).


Since loading.tsx is high level than customers, invoices, we can create an overview folder
add loading.tsx and page.tsx in this (overview) folder. These 2 files take effect on the other low level files

app\dashboard\(overview)
- loading.tsx
- page.tsx
    > customers
    > invoices
    


Now, the loading.tsx file will only apply to your dashboard overview page.

Route groups allow you to organize files into logical groups without affecting the URL path structure. When you create a new folder using parentheses (), the name won't be included in the URL path. So /dashboard/(overview)/page.tsx becomes /dashboard.

Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. However, you can also use route groups to separate your application into sections (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.

STREAMING COMPONENT

Suspense - allows you to defer rendering parts of your application until some condition is met (e.g. data is loaded). 

ex. 

In /app/dashboard/(overview)/page.tsx fetchRevenue(), this is the request that is slowing down the whole page.

import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // remove fetchRevenue

export default async function Page() {
  const revenue = await fetchRevenue() // delete this line



Then, import <Suspense> from React, and wrap it around <RevenueChart />. You can pass it a fallback component called <RevenueChartSkeleton>.

import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';


export default async function Page() {
    ...
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>



Finally, update the <RevenueChart> component to fetch its own data and remove the prop passed to it:

/app/ui/dashboard/revenue-chart.tsx


import { fetchRevenue } from '@/app/lib/data';


export default async function RevenueChart() { // Make component async, remove the props
  const revenue = await fetchRevenue(); // Fetch data inside the component




>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
10. ADDING SEARCH AND PAGINATION
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


 Next.js APIs: useSearchParams, usePathname, and useRouter.

 This is a template for search, table and pagination

 /app/dashboard/invoices/page.tsx
 app\ui\search.tsx


 Spend some time familiarizing yourself with the page and the components you'll be working with:

<Search/> allows users to search for specific invoices.
<Pagination/> allows users to navigate between pages of invoices.
<Table/> displays the invoices.


URL SEARCH PARAMS


As mentioned above, you'll be using URL search params to manage the search state. This pattern may be new if you're used to doing it with client side state.

There are a couple of benefits of implementing search with URL params:

Bookmarkable and shareable URLs: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.
Server-side rendering: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.
Analytics and tracking: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.



Adding the search functionality
These are the Next.js client hooks that you'll use to implement the search functionality:

useSearchParams- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
usePathname - Lets you read the current URL's pathname. For example, for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
useRouter - Enables navigation between routes within client components programmatically. There are multiple methods you can use.


Here's a quick overview of the implementation steps:

1.Capture the user's input.
2.Update the URL with the search params.
3.Keep the URL in sync with the input field.
4.Update the table to reflect the search query.


1. Capture the user's input
Go into the <Search> Component (/app/ui/search.tsx), and you'll notice:

"use client" - This is a Client Component, which means you can use event listeners and hooks.
<input> - This is the search input.


Create a new handleSearch function, and add an onChange listener to the <input> element. onChange will invoke handleSearch whenever the input value changes.


 app\ui\search.tsx


'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
 
export default function Search({ placeholder }: { placeholder: string }) {
  function handleSearch(term: string) {
    console.log(term);
  }


        onChange={(e) => {
          handleSearch(e.target.value);
        }}



2. Update the URL with the search params
Import the useSearchParams hook from next/navigation and assign it to a variable:


import { useSearchParams } from 'next/navigation';


export default function Search() {
  const searchParams = useSearchParams();




Inside handleSearch, create a new URLSearchParams instance using your new searchParams variable.

 function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
  }





URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters. Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.

Next, set the params string based on the user’s input. If the input is empty, you want to delete it:


    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }




3. Keeping the URL and input in sync

To ensure the input field is in sync with the URL and will be populated when sharing, you can pass a defaultValue to input by reading from searchParams:

 defaultValue={searchParams.get('query')?.toString()}


 UPDATING THE TABLE


Page components accept a prop called searchParams, so you can pass the current URL params to the <Table> component


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;



      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>


If you navigate to the <Table> Component, you'll see that the two props, query and currentPage, are passed to the fetchFilteredInvoices() function which returns the invoices that match the query.


/app/ui/invoices/table.tsx


// ...
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}







With these changes in place, go ahead and test it out. If you search for a term, you'll update the URL, which will send a new request to the server, data will be fetched on the server, and only the invoices that match your query will be returned.

When to use the useSearchParams() hook vs. the searchParams prop?

You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

<Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
<Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.



Best practice: Debouncing

Inside your handleSearch function, add the following console.log:

function handleSearch(term: string) {
  console.log(`Searching... ${term}`);


Searching... D
Searching... De
Searching... Del
Searching... Delb
Searching... Delba

You're updating the URL on every keystroke, and therefore querying your database on every keystroke! This isn't a problem as our application is small, but imagine if your application had thousands of users, each sending a new request to your database on each keystroke.

Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.

How Debouncing Works:

Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
Wait: If a new event occurs before the timer expires, the timer is reset.
Execution: If the timer reaches the end of its countdown, the debounced function is executed.




pnpm i use-debounce


In your <Search> Component, import a function called useDebouncedCallback:

// ...
import { useDebouncedCallback } from 'use-debounce';


// Inside the Search Component...
const handleSearch = useDebouncedCallback((term) => {
  console.log(`Searching... ${term}`);
 
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}, 300);


This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).

Dev Tools Console

Searching... Delba


By debouncing, you can reduce the number of requests sent to your database, thus saving resources.


Adding pagination


After introducing the search feature, you'll notice the table displays only 6 invoices at a time. This is because the fetchFilteredInvoices() function in data.ts returns a maximum of 6 invoices per page.

Adding pagination allows users to navigate through the different pages to view all the invoices. Let's see how you can implement pagination using URL params, just like you did with search.

Navigate to the <Pagination/> component and you'll notice that it's a Client Component. You don't want to fetch data on the client as this would expose your database secrets (remember, you're not using an API layer). Instead, you can fetch the data on the server, and pass it to the component as a prop.

In /dashboard/invoices/page.tsx, import a new function called fetchInvoicesPages and pass the query from searchParams as an argument:

import { fetchInvoicesPages } from '@/app/lib/data';


 const totalPages = await fetchInvoicesPages(query);


 fetchInvoicesPages returns the total number of pages based on the search query. For example, if there are 12 invoices that match the search query, and each page displays 6 invoices, then the total number of pages would be 2.

Next, pass the totalPages prop to the <Pagination/> component:


       <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>






/app/ui/invoices/pagination.tsx

import { usePathname, useSearchParams } from 'next/navigation';


export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;


  Next, create a new function inside the <Pagination> Component called createPageURL. Similarly to the search, you'll use URLSearchParams to set the new page number, and pathName to create the URL string.


    const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };



  Here's a breakdown of what's happening:

createPageURL creates an instance of the current search parameters.
Then, it updates the "page" parameter to the provided page number.
Finally, it constructs the full URL using the pathname and updated search parameters.
The rest of the <Pagination> component deals with styling and different states (first, last, active, disabled, etc). We won't go into detail for this course, but feel free to look through the code to see where createPageURL is being called.

Finally, when the user types a new search query, you want to reset the page number to 1. You can do this by updating the handleSearch function in your <Search> component:


/app/ui/search.tsx


  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');



>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
11. MUTATING DATA
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


 React Server Actions are and how to use them to mutate data.

 work with forms and Server Components.

 Best practices for working with the native FormData object, including type validation.

 revalidate the client cache using the revalidatePath API.

create dynamic route segments with specific IDs.




What are Server Actions?

React Server Actions allow you to run asynchronous code directly on the server. They eliminate the need to create API endpoints to mutate your data. Instead, you write asynchronous functions that execute on the server and can be invoked from your Client or Server Components.

Security is a top priority for web applications, as they can be vulnerable to various threats. This is where Server Actions come in. They include features like encrypted closures, strict input checks, error message hashing, host restrictions, and more — all working together to significantly enhance your application security.


In React, you can use the action attribute in the <form> element to invoke actions. The action will automatically receive the native FormData object, containing the captured data.

// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CREATING AN INVOICE -  CREATE
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Here are the steps you'll take to create a new invoice:

1 Create a form to capture the user's input.
2 Create a Server Action and invoke it from the form.
3 Inside your Server Action, extract the data from the formData object.
4 Validate and prepare the data to be inserted into your database.
5 Insert the data and handle any errors.
6 Revalidate the cache and redirect the user back to invoices page.

app\ui\invoices\create-form.tsx
app\lib\actions.ts
app\dashboard\invoices\create\page.tsx



2. Create a Server Action

/app/lib/actions.ts

'use server';
 
export async function createInvoice(formData: FormData) {}

Then, in your <Form> component, import the createInvoice from your actions.ts file. Add a action attribute to the <form> element, and call the createInvoice action.


import { createInvoice } from '@/app/lib/actions';


  return (
    <form action={createInvoice}>
      // ...
  )




/app/ui/invoices/create-form.tsx

import { createInvoice } from '@/app/lib/actions';

  return (
    <form action={createInvoice}>
      // ...
  )



3. Extract the data from formData

/app/lib/actions.ts


export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Test it out:
  console.log(rawFormData);


Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries().

To check everything is connected correctly, try out the form. After submitting, you should see the data you just entered into the form logged in your terminal (not the browser).

Now that your data is in the shape of an object, it'll be much easier to work with.


4. Validate and prepare the data

Before sending the form data to your database, you want to ensure it's in the correct format and with the correct types. If you remember from earlier in the course, your invoices table expects data in the following format:


export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};

So far, you only have the customer_id, amount, and status from the form.


It's important to validate that the data from your form aligns with the expected types in your database. For instance, if you add a console.log inside your action:

console.log(typeof rawFormData.amount);


You'll notice that amount is of type string and not number. This is because input elements with type="number" actually return a string, not a number!

To handle type validation, you have a few options. While you can manually validate types, using a type validation library can save you time and effort. For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.


In your actions.ts file, import Zod and define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.

/app/lib/actions.ts

'use server';
 
import { z } from 'zod';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
  // ...
}


The amount field is specifically set to coerce (change) from a string to a number while also validating its type.

You can then pass your rawFormData to CreateInvoice to validate the types:

// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
}



Storing values in cents
It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.

Let's convert the amount into cents:

// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
}


Creating new dates
Finally, let's create a new date with the format "YYYY-MM-DD" for the invoice's creation date:

/app/lib/actions.ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
}


5. Inserting the data into your database
Now that you have all the values you need for your database, you can create an SQL query to insert the new invoice into your database and pass in the variables:

import { z } from 'zod';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// ...
 
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}




6. Revalidate and redirect

Next.js has a client-side router cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.

Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js:


import { revalidatePath } from 'next/cache';


  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
 
  revalidatePath('/dashboard/invoices');


  Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

At this point, you also want to redirect the user back to the /dashboard/invoices page. You can do this with the redirect function from Next.js:

import { redirect } from 'next/navigation';


export async function createInvoice(formData: FormData) {
  // ...
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');



>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
UPDATING AN INVOICE - UPDATE
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


The updating invoice form is similar to the create an invoice form, except you'll need to pass the invoice id to update the record in your database. Let's see how you can get and pass the invoice id.

These are the steps you'll take to update an invoice:

1 Create a new dynamic route segment with the invoice id.
2 Read the invoice id from the page params.
3 Fetch the specific invoice from your database.
4 Pre-populate the form with the invoice data.
5 Update the invoice data in your database.


1. Create a Dynamic Route Segment with the invoice id
Next.js allows you to create Dynamic Route Segments when you don't know the exact segment name and want to create routes based on data. This could be blog post titles, product pages, etc. You can create dynamic route segments by wrapping a folder's name in square brackets. For example, [id], [post] or [slug].

In your /invoices folder, create a new dynamic route called [id], then a new route called edit with a page.tsx file. Your file structure should look like this:


app\dashboard\invoices\[id]\edit\page.tsx


In your <Table> component, notice there's a <UpdateInvoice /> button that receives the invoice's id from the table records.

/app/ui/invoices/table.tsx


export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...
    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
      <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}


Navigate to your <UpdateInvoice /> component, and update the href of the Link to accept the id prop. You can use template literals to link to a dynamic route segment:

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
// ...
 
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


2. Read the invoice id from page params
Back on your <Page> component, paste the following code:


import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}


Notice how it's similar to your /create invoice page, except it imports a different form (from the edit-form.tsx file). This form should be pre-populated with a defaultValue for the customer's name, invoice amount, and status. To pre-populate the form fields, you need to fetch the specific invoice using id.

In addition to searchParams, page components also accept a prop called params which you can use to access the id. Update your <Page> component to receive the prop:


import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // ...
}


3. Fetch the specific invoice
Then:

Import a new function called fetchInvoiceById and pass the id as an argument.
Import fetchCustomers to fetch the customer names for the dropdown.
You can use Promise.all to fetch both the invoice and customers in parallel:

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  // ...
}


You will see a temporary TypeScript error for the invoice prop in your terminal because invoice could be potentially undefined. Don't worry about it for now, you'll resolve it in the next chapter when you add error handling.

Great! Now, test that everything is wired correctly. Visit http://localhost:3000/dashboard/invoices and click on the Pencil icon to edit an invoice. After navigation, you should see a form that is pre-populated with the invoice details:



The URL should also be updated with an id as follows: http://localhost:3000/dashboard/invoice/uuid/edit

UUIDs vs. Auto-incrementing Keys

We use UUIDs instead of incrementing keys (e.g., 1, 2, 3, etc.). This makes the URL longer; however, UUIDs eliminate the risk of ID collision, are globally unique, and reduce the risk of enumeration attacks - making them ideal for large databases.

However, if you prefer cleaner URLs, you might prefer to use auto-incrementing keys.




4. Pass the id to the Server Action
Lastly, you want to pass the id to the Server Action so you can update the right record in your database. You cannot pass the id as an argument like so:

/app/ui/invoices/edit-form.tsx

// Passing an id as argument won't work
<form action={updateInvoice(id)}>
Instead, you can pass id to the Server Action using JS bind. This will ensure that any values passed to the Server Action are encoded.

/app/ui/invoices/edit-form.tsx

// ...
import { updateInvoice } from '@/app/lib/actions';
 
export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
 
  return <form action={updateInvoiceWithId}>{/* ... */}</form>;
}
Note: Using a hidden input field in your form also works (e.g. <input type="hidden" name="id" value={invoice.id} />). However, the values will appear as full text in the HTML source, which is not ideal for sensitive data.

Then, in your actions.ts file, create a new action, updateInvoice:

/app/lib/actions.ts
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
Similarly to the createInvoice action, here you are:

Extracting the data from formData.
Validating the types with Zod.
Converting the amount to cents.
Passing the variables to your SQL query.
Calling revalidatePath to clear the client cache and make a new server request.
Calling redirect to redirect the user to the invoice's page.
Test it out by editing an invoice. After submitting the form, you should be redirected to the invoices page, and the invoice should be updated.



>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
DELETING AN INVOICE - DELETE
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Deleting an invoice
To delete an invoice using a Server Action, wrap the delete button in a <form> element and pass the id to the Server Action using bind:

/app/ui/invoices/buttons.tsx
import { deleteInvoice } from '@/app/lib/actions';
 
// ...
 
export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
 
  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

Inside your actions.ts file, create a new action called deleteInvoice.


export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}


Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.


>>>>>>>>>>>>>>>>>>>>>
12. HANDLING ERRORS
>>>>>>>>>>>>>>>>>>>>>>

use the special error.tsx file to catch errors in your route segments, and show a fallback UI to the user.


use the notFound function and not-found file to handle 404 errors (for resources that don’t exist).



Adding try/catch to Server Actions
First, let's add JavaScript's try/catch statements to your Server Actions to allow you to handle errors gracefully.

If you know how to do this, spend a few minutes updating your Server Actions, or you can copy the code below:


export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}





Note how redirect is being called outside of the try/catch block. This is because redirect works by throwing an error, which would be caught by the catch block. To avoid this, you can call redirect after try/catch. redirect would only be reachable if try is successful.

We're gracefully handling these errors by catching the database issue, and returning a helpful message from our Server Action.

What happens if there is an uncaught exception in your action? We can simulate this by manually throwing an error. For example, in the deleteInvoice action, throw an error at the top of the function:

/app/lib/actions.ts

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
 
  // Unreachable code block
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}


When you try to delete an invoice, you should see the error on localhost. When going to production, you want to more gracefully show a message to the user when something unexpected happens.

This is where Next.js error.tsx file comes in. Ensure that you remove this manually added error after testing and before moving onto the next section.



Handling all errors with error.tsx
The error.tsx file can be used to define a UI boundary for a route segment. It serves as a catch-all for unexpected errors and allows you to display a fallback UI to your users.

Inside your /dashboard/invoices folder, create a new file called error.tsx and paste the following code:

/dashboard/invoices/error.tsx

'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}


There are a few things you'll notice about the code above:

"use client" - error.tsx needs to be a Client Component.
It accepts two props:
error: This object is an instance of JavaScript's native Error object.
reset: This is a function to reset the error boundary. When executed, the function will try to re-render the route segment.
When you try to delete an invoice again, you should see the following UI:



Handling 404 errors with the notFound function
Another way you can handle errors gracefully is by using the notFound function. While error.tsx is useful for catching uncaught exceptions, notFound can be used when you try to fetch a resource that doesn't exist.

For example, visit http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit.

This is a fake UUID that doesn't exist in your database.

You'll immediately see error.tsx kicks in because this is a child route of /invoices where error.tsx is defined.

However, if you want to be more specific, you can show a 404 error to tell the user the resource they're trying to access hasn't been found.

You can confirm that the resource hasn't been found by going into your fetchInvoiceById function in data.ts, and adding a console log for the returned invoice:

/app/lib/data.ts


export async function fetchInvoiceById(id: string) {
  try {
    // ...
 
    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}


Now that you know the invoice doesn't exist in your database, let's use notFound to handle it. Navigate to /dashboard/invoices/[id]/edit/page.tsx, and import { notFound } from 'next/navigation'.

Then, you can use a conditional to invoke notFound if the invoice doesn't exist:

import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
 
  if (!invoice) {
    notFound();
  }
 
  // ...
}


Refresh the route, and you should now see the following UI:

404 Not Found Page

That's something to keep in mind, notFound will take precedence over error.tsx, so you can reach out for it when you want to handle more specific errors!

>>>>>>>>>>>>>>>>>>>>>>>>>>>
13. IMPROVING ACCESSIBILITY
>>>>>>>>>>>>>>>>>>>>>>>>>>>>


In the previous chapter, we looked at how to catch errors (including 404 errors) and display a fallback to the user. However, we still need to discuss another piece of the puzzle: form validation. Let's see how to implement server-side validation with Server Actions, and how you can show form errors using React's useActionState hook - while keeping accessibility in mind!


use eslint-plugin-jsx-a11y with Next.js to implement accessibility best practices.

 implement server-side form validation.

use the React useActionState hook to handle form errors, and display them to the user.



Using the ESLint accessibility plugin in Next.js
Next.js's ESLint configuration includes the eslint-plugin-jsx-a11y plugin, which helps catch accessibility issues early. For example, this plugin warns if you have images without alt text, use the aria-* and role attributes incorrectly, and more.

Begin by installing ESLint:

pnpm add -D eslint eslint-config-next

Next, create an eslint.config.mjs file in the root of your project with the following content:

CONTINUE READING IN THE DOCS

https://nextjs.org/learn/dashboard-app/improving-accessibility


>>>>>>>>>>>>>>>>>>>>>>>>>>>
14. ADDING AUTHENTICATION
>>>>>>>>>>>>>>>>>>>>>>>>>>>>

add authentication to your app using NextAuth.js.

 use Proxy to redirect users and protect your routes.

 use React's useActionState to handle pending states and form errors.



What is authentication?
Authentication is a key part of many web applications today. It's how a system checks if the user is who they say they are.

A secure website often uses multiple ways to check a user's identity. For instance, after entering your username and password, the site may send a verification code to your device or use an external app like Google Authenticator. This 2-factor authentication (2FA) helps increase security. Even if someone learns your password, they can't access your account without your unique token.


Authentication vs. Authorization
In web development, authentication and authorization serve different roles:

Authentication is about making sure the user is who they say they are. You're proving your identity with something you have like a username and password.
Authorization is the next step. Once a user's identity is confirmed, authorization decides what parts of the application they are allowed to use.
So, authentication checks who you are, and authorization determines what you can do or access in the application.



CREATE A LOGIN ROUTE

/app/login/page.tsx 

import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}


app/ui/login-form 


You'll notice the page imports <LoginForm />, which you'll update later in the chapter. This component is wrapped with React <Suspense> because it will access information from the incoming request (URL search params).


NextAuth.js
We will be using NextAuth.js to add authentication to your application. NextAuth.js abstracts away much of the complexity involved in managing sessions, sign-in and sign-out, and other aspects of authentication. While you can manually implement these features, the process can be time-consuming and error-prone. NextAuth.js simplifies the process, providing a unified solution for auth in Next.js applications.


Setting up NextAuth.js
Install NextAuth.js by running the following command in your terminal:

pnpm i next-auth@beta

Here, you're installing the beta version of NextAuth.js, which is compatible with Next.js 14+.

Next, generate a secret key for your application. This key is used to encrypt cookies, ensuring the security of user sessions. You can do this by running the following command in your terminal:


# macOS
openssl rand -base64 32
# Windows can use https://generate-secret.vercel.app/32


Then, in your .env file, add your generated key to the AUTH_SECRET variable:

AUTH_SECRET=your-secret-key

For auth to work in production, you'll need to update your environment variables in your Vercel project too. Check out this guide on how to add environment variables on Vercel.

Adding the pages option

Create an auth.config.ts file at the root of our project that exports an authConfig object. This object will contain the configuration options for NextAuth.js. For now, it will only contain the pages option:

/auth.config.ts

import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;


You can use the pages option to specify the route for custom sign-in, sign-out, and error pages. This is not required, but by adding signIn: '/login' into our pages option, the user will be redirected to our custom login page, rather than the NextAuth.js default page.


Protecting your routes with Next.js Proxy

Next, add the logic to protect your routes. This will prevent users from accessing the dashboard pages unless they are logged in.


import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;



The authorized callback is used to verify if the request is authorized to access a page with Next.js Proxy. It is called before a request is completed, and it receives an object with the auth and request properties. The auth property contains the user's session, and the request property contains the incoming request.

The providers option is an array where you list different login options. For now, it's an empty array to satisfy NextAuth config. You'll learn more about it in the Adding the Credentials provider section.

Next, you will need to import the authConfig object into a Proxy file. In the root of your project, create a file called proxy.ts and paste the following code:

/proxy.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


Here you're initializing NextAuth.js with the authConfig object and exporting the auth property. You're also using the matcher option from Proxy to specify that it should run on specific paths.

The advantage of employing Proxy for this task is that the protected routes will not even start rendering until the Proxy verifies the authentication, enhancing both the security and performance of your application.



Password hashing


It's good practice to hash passwords before storing them in a database. Hashing converts a password into a fixed-length string of characters, which appears random, providing a layer of security even if the user's data is exposed.

When seeding your database, you used a package called bcrypt to hash the user's password before storing it in the database. You will use it again later in this chapter to compare that the password entered by the user matches the one in the database. However, you will need to create a separate file for the bcrypt package. This is because bcrypt relies on Node.js APIs not available in Next.js Proxy.

Create a new file called auth.ts that spreads your authConfig object:


auth.ts



import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});


Adding the Credentials provider
Next, you will need to add the providers option for NextAuth.js. providers is an array where you list different login options such as Google or GitHub. For this course, we will focus on using the Credentials provider only.

The Credentials provider allows users to log in with a username and a password.


/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});


Good to know:

There are other alternative providers such as OAuth or email. See the NextAuth.js docs for a full list of options.

Adding the sign in functionality
You can use the authorize function to handle the authentication logic. Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database:





import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});


After validating the credentials, create a new getUser function that queries the user from the database.


import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }
 
        return null;
      },
    }),
  ],
});


Then, call bcrypt.compare to check if the passwords match:


import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// ...
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});


Finally, if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in.

Updating the login form

Now you need to connect the auth logic with your login form. In your actions.ts file, create a new action called authenticate. This action should import the signIn function from auth.ts:



app\lib\actions.ts


'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}



If there's a 'CredentialsSignin' error, you want to show an appropriate error message. You can learn about NextAuth.js errors in the documentation

Finally, in your login-form.tsx component, you can use React's useActionState to call the server action, handle form errors, and display the form's pending state:


app/ui/login-form.tsx - check the code it's long


import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';




export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );



  return (
    <form action={formAction} className="space-y-3">


   <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}




Adding the logout functionality

To add the logout functionality to <SideNav />, call the signOut function from auth.ts in your <form> element:



/ui/dashboard/sidenav.tsx

import { signOut } from '@/auth';



        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}






Try it out
Now, try it out. You should be able to log in and out of your application using the following credentials:

Email: user@nextmail.com
Password: 123456




 

>>>>>>>>>>>>>>>>>>>>>>>>>>>
14. ADDING METADATA
>>>>>>>>>>>>>>>>>>>>>>>>>>>>
