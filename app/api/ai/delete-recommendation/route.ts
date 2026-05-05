import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { recommendationId } = body

    if (!recommendationId) {
      return NextResponse.json(
        { error: 'Recommendation ID is required' },
        { status: 400 }
      )
    }

    // Get user ID from Convex (using Clerk ID)
    const user = await convex.query(api.users.getUser, { clerkId: userId })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the recommendation to verify ownership
    const recommendation = await convex.query(api.aiRecommendations.getRecommendation, {
      recommendationId: recommendationId as any
    })

    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      )
    }

    // Verify the recommendation belongs to the user
    if (recommendation.userId !== user._id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Delete the recommendation
    await convex.mutation(api.aiRecommendations.deleteRecommendation, {
      recommendationId: recommendationId as any
    })

    return NextResponse.json({
      success: true,
      message: 'Recommendation deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting recommendation:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
