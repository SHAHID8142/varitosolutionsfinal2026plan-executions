/**
 * @file page.tsx
 * @path /
 * @description Server component for Homepage.
 *              Handles SEO metadata and wraps HomeContent.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import { Metadata } from "next"
import HomeContent from "./home-content"

export const metadata: Metadata = {
  title: "Varito Solutions | Premium Sanitary & Packaging Materials",
  description: "Shop luxury bathroom fittings and high-grade packaging materials in Bangladesh. Fast delivery and verified quality at Varito Solutions.",
  openGraph: {
    title: "Varito Solutions | Premium Sanitary & Packaging Materials",
    description: "Your trusted online store for luxury bathroom fittings and high-grade packaging materials in Bangladesh.",
    url: "https://varitosolutions.com",
    type: "website",
  },
}

export default function HomePage() {
  return <HomeContent />
}
