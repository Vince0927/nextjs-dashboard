
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