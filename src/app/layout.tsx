import type { Metadata } from "next";
import { plusJakartaSans, hindSiliguri } from "@/lib/fonts";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "Varito Solutions | Your Trusted Online Store",
  description: "Sanitary Items & Packaging Materials in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${hindSiliguri.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
