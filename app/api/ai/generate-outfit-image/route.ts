import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { design, bodyType, occasion, colorPreferences, stylePreferences } = body

    if (!design || !bodyType || !occasion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = encodeURIComponent(
      `${design}, Ankara African wax print fashion, ${bodyType} body, ${occasion}, ${colorPreferences || 'vibrant colors'}, full body, white background, professional fashion photo`
    )

    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=768&nologo=true&seed=${Date.now()}`

    // Return URL directly - let browser load it
    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Outfit visualization generated successfully'
    })

  } catch (error) {
    console.error('Error generating outfit image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
