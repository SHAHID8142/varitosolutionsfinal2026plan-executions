/**
 * @file next.config.ts
 * @description Next.js configuration with security headers and image domains.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import type { NextConfig } from "next"

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // Cloudflare R2 public bucket
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        // Custom CDN domain (set this in env)
        protocol: "https",
        hostname: "cdn.varito.com.bd",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
