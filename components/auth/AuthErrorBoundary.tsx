"use client"

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface AuthStatus {
  isLoaded: boolean
  isSignedIn: boolean
  userId: string | null
  error: string | null
}

export function useAuthStatus(): AuthStatus {
  const { user, isLoaded } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set a timeout to detect if Clerk is taking too long to load
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setError('Authentication service is taking longer than expected to load')
        console.warn('Clerk authentication timeout - taking longer than 10 seconds to load')
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [isLoaded])

  return {
    isLoaded,
    isSignedIn: !!user,
    userId: user?.id || null,
    error
  }
}

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const { error } = useAuthStatus()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Authentication Service Issue
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
