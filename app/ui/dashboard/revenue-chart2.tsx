//revenue chart ui
import { fetchRevenue2 } from "@/app/lib/data";

export async function RevenueChart2() {
  const revenue = await fetchRevenue2();

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div>
      <h2>Revenue Chart 2 From Database</h2>
      {revenue.map((rev) => (
        <p key={rev.month}>
          {rev.month}: {rev.revenue}
        </p>
      ))}
    </div>
  );
}
