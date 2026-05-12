'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import { Suspense } from 'react'
import PostHogPageView from "@/providers/posthog-page-view";

if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (key) {
    posthog.init(key, {
      api_host: host || 'https://app.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We track this manually in PostHogPageView
    })
    // @ts-ignore - for debugging
    if (typeof window !== 'undefined') window.posthog = posthog
  }
}

interface PostHogProviderProps {
  children: ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
