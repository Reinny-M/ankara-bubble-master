import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const height = formData.get('height') as string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = image.type

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are an expert body measurement analyst. Analyze this full-body photo and estimate the person's body measurements.
${height ? `The person's height is ${height}cm - use this as reference.` : 'Estimate height from proportions.'}
Return ONLY valid JSON, no other text:
{
  "bust": <number in cm>,
  "waist": <number in cm>,
  "hips": <number in cm>,
  "estimatedHeight": <number in cm>,
  "bodyType": "hourglass" or "pear" or "apple" or "rectangle" or "inverted-triangle",
  "confidence": "high" or "medium" or "low",
  "notes": "<brief analysis note>",
  "suggestions": ["<tip1>", "<tip2>", "<tip3>"]
}`

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType: mediaType } },
      prompt
    ])

    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No valid JSON in AI response')

    const measurements = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: measurements })

  } catch (error) {
    console.error('Error extracting measurements from photo:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract measurements',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
