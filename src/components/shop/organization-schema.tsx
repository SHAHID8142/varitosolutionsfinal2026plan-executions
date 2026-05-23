/**
 * @file organization-schema.tsx
 * @description JSON-LD structured data for Organization SEO.
 *              Helps search engines understand brand details, social profiles, and contact info.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Varito Solutions",
    "url": "https://varitosolutions.com",
    "logo": "https://varitosolutions.com/logos/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+8801814214220",
      "contactType": "customer service",
      "areaServed": "BD",
      "availableLanguage": ["Bengali", "English"]
    },
    "sameAs": [
      "https://facebook.com/varitosolutions",
      "https://instagram.com/varitosolutions",
      "https://linkedin.com/company/varitosolutions"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
