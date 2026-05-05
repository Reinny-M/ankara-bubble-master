"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi } from "lucide-react"

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
      
      if (!convexUrl) {
        console.error('NEXT_PUBLIC_CONVEX_URL is not defined')
        setIsLoading(false)
        return
      }

      try {
        const client = new ConvexReactClient(convexUrl)
        setConvex(client)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize Convex client:', error)
        setIsLoading(false)
      }
    }
  }, [])

  // During SSR/prerendering, just render children without ConvexProvider
  if (!isClient) {
    return <>{children}</>
  }

  // Show loading state while Convex is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Wifi className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Connecting...
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 text-center">
              Setting up your personalized experience
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If Convex failed to initialize, render children without provider
  if (!convex) {
    return <>{children}</>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
