import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { occasion, bodyType, colorPreferences, stylePreferences, budget } = body

    // Validate required fields
    if (!occasion || !bodyType) {
      return NextResponse.json(
        { error: 'Missing required fields: occasion, bodyType' },
        { status: 400 }
      )
    }

    // Validate occasion
    const validOccasions = [
      'casual', 'business', 'formal', 'party', 'wedding', 'church', 
      'office', 'date', 'travel', 'cultural event', 'graduation'
    ]
    
    if (!validOccasions.includes(occasion.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid occasion. Must be one of: ${validOccasions.join(', ')}` },
        { status: 400 }
      )
    }

    // Get style recommendations using AI
    const recommendations = await AIService.getStyleRecommendations({
      occasion: occasion.toLowerCase(),
      bodyType,
      colorPreferences: colorPreferences || undefined,
      stylePreferences: stylePreferences || undefined,
      budget: budget || undefined
    })

    return NextResponse.json({
      success: true,
      data: recommendations
    })

  } catch (error) {
    console.error('Error getting style recommendations:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get style recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
