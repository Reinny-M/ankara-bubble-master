import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { getUserId } from '@/lib/auth-helper'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user using helper
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No user ID found' },
        { status: 401 }
      )
    }

    // Get user ID from Convex (using Clerk ID)
    const user = await convex.query(api.users.getUser, { clerkId: userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Get all recommendations for the user
    const recommendations = await convex.query(api.aiRecommendations.getRecommendationsByUser, {
      userId: user._id
    })

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length
    })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
