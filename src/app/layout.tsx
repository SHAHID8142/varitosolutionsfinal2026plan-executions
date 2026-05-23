import type { Metadata, Viewport } from "next";
import { plusJakartaSans, hindSiliguri } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "./posthog-provider";
import { PostHogPageView } from "./posthog-pageview";
import { FacebookMessenger } from "@/components/ui/facebook-messenger";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import "./../styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://varitosolutions.com"),
// ... (rest of metadata)
  title: {
    default: "Varito Solutions | Premium Sanitary & Packaging Materials",
    template: "%s | Varito Solutions",
  },
  description: "Your trusted online store for luxury bathroom fittings and high-grade packaging materials in Bangladesh. Fast delivery and verified quality.",
  keywords: ["sanitary ware", "packaging materials", "bathroom fittings", "tapes", "cartons", "Bangladesh", "Chattogram"],
  authors: [{ name: "Varito Solutions" }],
  creator: "Varito Solutions",
  publisher: "Varito Solutions",
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://varitosolutions.com",
    siteName: "Varito Solutions",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Varito Solutions Premium Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varito Solutions | Premium Sanitary & Packaging",
    description: "Upgrade your home and business with Varito Solutions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <PostHogPageView />
          {children}
          <Toaster />
          <FacebookMessenger />
          <PWAInstallPrompt />
        </PostHogProvider>
      </body>
    </html>
  );
}
