"use client"

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (isLoaded && user) {
      // Set user data from Clerk only
      setUserData({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: (user.unsafeMetadata?.role as "client" | "tailor" | "admin") || 'client',
        avatar: user.imageUrl,
      })
    }
  }, [isLoaded, user])

  return <>{children}</>
}
