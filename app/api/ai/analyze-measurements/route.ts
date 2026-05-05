import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { height, bust, waist, hips, age, gender } = body

    // Validate required fields
    if (!height || !bust || !waist || !hips) {
      return NextResponse.json(
        { error: 'Missing required measurements: height, bust, waist, hips' },
        { status: 400 }
      )
    }

    // Validate measurement ranges
    if (height < 100 || height > 250) {
      return NextResponse.json(
        { error: 'Height must be between 100cm and 250cm' },
        { status: 400 }
      )
    }

    if (bust < 50 || bust > 200) {
      return NextResponse.json(
        { error: 'Bust measurement must be between 50cm and 200cm' },
        { status: 400 }
      )
    }

    if (waist < 40 || waist > 150) {
      return NextResponse.json(
        { error: 'Waist measurement must be between 40cm and 150cm' },
        { status: 400 }
      )
    }

    if (hips < 50 || hips > 200) {
      return NextResponse.json(
        { error: 'Hips measurement must be between 50cm and 200cm' },
        { status: 400 }
      )
    }

    // Analyze measurements using AI
    const analysis = await AIService.analyzeMeasurements({
      height: Number(height),
      bust: Number(bust),
      waist: Number(waist),
      hips: Number(hips),
      age: age ? Number(age) : undefined,
      gender: gender || undefined
    })

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error analyzing measurements:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze measurements',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
