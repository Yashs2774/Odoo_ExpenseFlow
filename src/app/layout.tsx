// app/layout.tsx

import { Geist } from "next/font/google";
// We will assume dashboard.css contains truly global styles. If not, it should be a CSS Module.
import "./styles/dashboard.css";
import { Providers } from "./providers"; // Import your new Providers component

// Set up your primary font using CSS variables for flexibility
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "ExpenseFlow",
  description: "Expense Management System Dashboard",
};

// KEY CHANGE: Added correct TypeScript types for props
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    // KEY CHANGE: Apply the font variable to the <html> tag
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {/* KEY CHANGE: Use the new Providers component to wrap children */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
