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

    // Get user ID from Convex (using Clerk ID)
    const user = await convex.query(api.users.getUser, { clerkId: userId })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const convexUserId = user._id

    // Delete all user-related data from Convex
    try {
      // Delete AI recommendations
      const recommendations = await convex.query(api.aiRecommendations.getRecommendationsByUser, {
        userId: convexUserId
      })
      
      for (const recommendation of recommendations) {
        await convex.mutation(api.aiRecommendations.deleteRecommendation, {
          recommendationId: recommendation._id,
        })
      }

      // Delete orders (if any)
      const orders = await convex.query(api.orders.getOrdersByUser, {
        userId: convexUserId
      })
      
      for (const order of orders) {
        await convex.mutation(api.orders.deleteOrder, {
          id: order._id,
          userId: convexUserId
        })
      }

      // Delete designs (if user is a tailor)
      const designs = await convex.query(api.designs.getDesignsByTailor, {
        tailorId: convexUserId
      })
      
      for (const design of designs) {
        await convex.mutation(api.designs.deleteDesign, {
          id: design._id,
          tailorId: convexUserId
        })
      }

      // Finally, delete the user record
      await convex.mutation(api.users.deleteUser, {
        userId: convexUserId
      })

    } catch (convexError) {
      console.error('Error cleaning up user data:', convexError)
      // Continue with deletion even if some data cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: 'User data cleaned up successfully'
    })

  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
