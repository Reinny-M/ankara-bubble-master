import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
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
    
    // Validate required fields
    const {
      measurements,
      bodyType,
      bodyTypeConfidence,
      occasion,
      designRecommendations,
      designCategories,
      fabricSuggestions,
      stylingTips,
      recommendedDesigns,
      colorCombinations,
      accessories,
      stylingNotes,
      colorPreferences,
      stylePreferences,
      budget
    } = body

    if (!measurements || !bodyType || !occasion || !designRecommendations || !stylingNotes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check for existing recommendations (same measurements, body type, and occasion)
    const existingRecommendations = await convex.query(api.aiRecommendations.getRecommendationsByUser, {
      userId: user._id
    })

    const existingRecommendation = existingRecommendations.find(rec => 
      rec.measurements.height === measurements.height &&
      rec.measurements.bust === measurements.bust &&
      rec.measurements.waist === measurements.waist &&
      rec.measurements.hips === measurements.hips &&
      rec.bodyType === bodyType &&
      rec.occasion === occasion
    )

    const convexUserId = user._id
    let recommendationId: any
    let message: string

    if (existingRecommendation) {
      // Update existing recommendation
      recommendationId = await convex.mutation(api.aiRecommendations.updateRecommendation, {
        recommendationId: existingRecommendation._id,
        measurements: {
          height: measurements.height,
          bust: measurements.bust,
          waist: measurements.waist,
          hips: measurements.hips,
          age: measurements.age,
          gender: measurements.gender,
        },
        bodyType,
        bodyTypeConfidence: bodyTypeConfidence || 'ai-refined',
        occasion,
        colorPreferences,
        stylePreferences,
        budget,
        designRecommendations,
        designCategories,
        fabricSuggestions,
        stylingTips,
        recommendedDesigns,
        colorCombinations,
        accessories,
        stylingNotes,
      })
      message = 'Recommendation updated successfully'
    } else {
      // Create new recommendation
      recommendationId = await convex.mutation(api.aiRecommendations.saveRecommendation, {
        userId: convexUserId,
        measurements: {
          height: measurements.height,
          bust: measurements.bust,
          waist: measurements.waist,
          hips: measurements.hips,
          age: measurements.age,
          gender: measurements.gender,
        },
        bodyType,
        bodyTypeConfidence: bodyTypeConfidence || 'ai-refined',
        occasion,
        colorPreferences,
        stylePreferences,
        budget,
        designRecommendations,
        designCategories,
        fabricSuggestions,
        stylingTips,
        recommendedDesigns,
        colorCombinations,
        accessories,
        stylingNotes,
      })
      message = 'Recommendation saved successfully'
    }

    return NextResponse.json({
      success: true,
      recommendationId,
      message,
      isUpdate: !!existingRecommendation
    })

  } catch (error) {
    console.error('Error saving recommendation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
