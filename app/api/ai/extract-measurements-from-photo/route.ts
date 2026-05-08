import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mediaType};base64,${base64}`,
                detail: 'high'
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })

    const text = response.choices[0].message.content || ''
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
