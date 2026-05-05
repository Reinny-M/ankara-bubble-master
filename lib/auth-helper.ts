import { auth } from '@clerk/nextjs/server'

/**
 * Robust authentication helper that handles Clerk loading issues
 */
export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }
    
    return userId
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Check if user is authenticated with fallback handling
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getAuthenticatedUser()
  return !!userId
}

/**
 * Get user ID with error handling
 */
export async function getUserId(): Promise<string | null> {
  return await getAuthenticatedUser()
}
