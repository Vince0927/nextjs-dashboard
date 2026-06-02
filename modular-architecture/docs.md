1. Creating a new project

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

2. CSS STYLING

app\layout.tsx

app\ui\global.css - root css layout

You can use this file to add CSS rules to all the routes in your application - such as CSS reset rules, site-wide styles for HTML elements like links, and more.

If you take a look inside global.css, you'll notice some @tailwind directives:

@tailwind base;
@tailwind components;
@tailwind utilities;