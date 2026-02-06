import DashboardSkeleton from "@/app/ui/skeletons";

// This is a special Next.js file that automatically wraps the page.tsx
// in a Suspense boundary. It shows this UI immediately while the
// page content is loading.
export default function Loading() {
  return <DashboardSkeleton />;
}
