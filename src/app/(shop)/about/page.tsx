/**
 * @file page.tsx
 * @path /about
 * @description Server component for About Us page.
 *              Handles SEO metadata and wraps AboutContent.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import { Metadata } from "next"
import AboutContent from "./about-content"

export const metadata: Metadata = {
  title: "About Us | Varito Solutions",
  description: "Learn more about Varito Solutions, your trusted partner for premium sanitary ware and high-grade packaging materials in Bangladesh.",
  openGraph: {
    title: "About Us | Varito Solutions",
    description: "Discover our mission, values, and commitment to quality at Varito Solutions.",
    url: "https://varitosolutions.com/about",
    type: "website",
  },
}

export default function AboutPage() {
  return <AboutContent />
}
