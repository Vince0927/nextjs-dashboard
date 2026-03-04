"use client";

import { useState } from "react";

//it uses shadcn/ui button component, which is a reusable button component
// that can be styled using variants and sizes. It also supports an "asChild" prop that
// allows it to render as a different element, such as a link or a div, while still applying the button styles and behavior. The button component is imported from the "@/components/ui/button" path, which is likely a local file in the project that defines the button component and its styles.
import { Button } from "@/components/ui/button";


//accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


//alert
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, InfoIcon } from "lucide-react"


//input
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


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

function CustomersPage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1><b>Customers Page</b></h1>
        <p>Counter: {count}</p>
        <Button variant="outline" onClick={() => setCount(count + 1)}>
          click
        </Button>
        <h1><b>Accordion</b></h1>
        <Accordion className="max-w-lg rounded-lg border" defaultValue="item-1">
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-b px-4 last:border-b-0"
            >
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="grid w-full max-w-md items-start gap-4">
      <h1><b>Alerts</b></h1>
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Test AlertPayment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon />
        <AlertTitle>Test AlertNew feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
         <h1><b>Form Fields / Input</b></h1>
<FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
        <Input id="fieldgroup-name" placeholder="Jordan Lee" />
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
        <Input
          id="fieldgroup-email"
          type="email"
          placeholder="name@example.com"
        />
        <FieldDescription>
          We&apos;ll send updates to this address.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field>
    </FieldGroup>
    </div>

    </>
  );
}

export default CustomersPage;
