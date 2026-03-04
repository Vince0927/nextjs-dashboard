// this file is a **server component**; interactive bits live in CustomersClient

import { RevenueChart2 } from "@/app/ui/dashboard/revenue-chart2";
import CustomersClient from "./CustomersClient";

const items = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
];

export function CustomersPage() {
  return (
    <>
      {/* client-side interactive portion */}
      <CustomersClient />

      {/* server component – safe to fetch from postgres */}
      <h1>Revenue Chart</h1>
      <RevenueChart2 />
    </>
  );
}

export default CustomersPage;
