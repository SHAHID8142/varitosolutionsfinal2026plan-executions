/**
 * @file posthog-pageview.tsx
 * @description Component to track page views on route changes in Next.js App Router.
 *              Captures the current URL and sends it to PostHog.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'

function PostHogPageViewContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { '$current_url': url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewContent />
    </Suspense>
  )
}
