import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS Projects Dashboard",
  description: "Compare modern headless CMS projects and their technology stacks.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
