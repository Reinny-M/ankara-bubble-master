"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'client' | 'tailor' | 'admin'
  fallbackUrl?: string
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackUrl = '/' 
}: AuthGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      // User not authenticated, redirect to login
      router.push('/login')
      return
    }

    if (requiredRole) {
      const userRole = user.unsafeMetadata?.role as string
      
      if (userRole !== requiredRole) {
        // User doesn't have required role, redirect to appropriate dashboard
        if (userRole === 'admin') {
          router.push('/admin/dashboard')
        } else if (userRole === 'tailor') {
          router.push('/tailor/dashboard')
        } else {
          router.push('/client/dashboard')
        }
        return
      }
    }

    setIsChecking(false)
  }, [user, isLoaded, requiredRole, router])

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-stone-600 dark:text-stone-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
