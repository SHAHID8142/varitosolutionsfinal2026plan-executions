/**
 * @file posthog-provider.tsx
 * @description PostHog analytics provider for the application.
 *              Initializes PostHog with client-side configuration.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // PostHog initialization
    // Key and Host are usually in env vars, using placeholders for now
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_placeholder', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
      capture_pageview: false, // We capture manually for App Router
      capture_pageleave: true,
      autocapture: false,
      persistence: 'localStorage',
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
