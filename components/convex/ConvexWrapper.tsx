"use client"

import { useConvex } from "convex/react"
import { ReactNode } from "react"

interface ConvexWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ConvexWrapper({ children, fallback }: ConvexWrapperProps) {
  const convex = useConvex()
  
  if (!convex) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
