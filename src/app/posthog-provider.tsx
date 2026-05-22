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
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com'

    if (key && key !== 'phc_placeholder') {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false, // We capture manually for App Router
        capture_pageleave: true,
        autocapture: false,
        persistence: 'localStorage',
      })
    } else {
      console.warn('PostHog key not found. Analytics is disabled.')
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
