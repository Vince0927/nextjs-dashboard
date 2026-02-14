import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts"; // Import the Inter font from Google Fonts

//this is the root layout for the entire app.
// It wraps all pages and components.
// We can use it to set up global styles, fonts, and other providers.

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
