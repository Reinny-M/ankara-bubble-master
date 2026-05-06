import Groq from 'groq-sdk'
import { calculateBodyShape, getBasicStylingTips } from './body-shape-calculator'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'llama-3.3-70b-versatile'

interface MeasurementAnalysis {
  bodyType: string
  recommendations: string[]
  designCategories: string[]
  fabricSuggestions: string[]
  stylingTips: string[]
}

interface StyleRecommendation {
  occasion: string
  designs: string[]
  colors: string[]
  accessories: string[]
  stylingNotes: string
}

interface ImageGenerationRequest {
  design: string
  bodyType: string
  occasion: string
  colorPreferences?: string
  stylePreferences?: string
  measurements: {
    height: number
    bust: number
    waist: number
    hips: number
  }
}

interface ImageGenerationResponse {
  success: boolean
  imageUrl?: string | null
  message: string
  error?: string
  rawResponse?: string
}

async function callGroq(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
    temperature: 0.7,
  })
  return completion.choices[0].message.content || ''
}

function extractJSON(text: string): any | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      return null
    }
  }
  return null
}

export class AIService {
  static async analyzeMeasurements(measurements: {
    height: number
    bust: number
    waist: number
    hips: number
    age?: number
    gender?: string
  }): Promise<MeasurementAnalysis> {
    const programmaticResult = calculateBodyShape({
      bust: measurements.bust,
      waist: measurements.waist,
      hips: measurements.hips,
      gender: measurements.gender
    })

    const prompt = `
You are an expert fashion stylist specializing in Ankara (African wax print) fashion.

BODY MEASUREMENTS:
- Height: ${measurements.height}cm
- Bust: ${measurements.bust}cm
- Waist: ${measurements.waist}cm
- Hips: ${measurements.hips}cm
${measurements.age ? `- Age: ${measurements.age} years` : ''}
${measurements.gender ? `- Gender: ${measurements.gender}` : ''}

PROGRAMMATIC BODY TYPE ANALYSIS:
- Detected Type: ${programmaticResult.bodyType}
- Confidence: ${programmaticResult.confidence}

TASK:
1. Validate or refine the body type classification
2. Provide 3-5 specific Ankara design recommendations
3. Suggest 3-5 design categories that work well
4. Recommend 3-5 fabric types for Ankara prints
5. Give 5 styling tips specific to this body type

Respond ONLY with valid JSON, no extra text:
{
  "bodyType": "string",
  "bodyTypeReasoning": "string",
  "recommendations": ["string", "string", "string"],
  "designCategories": ["string", "string", "string"],
  "fabricSuggestions": ["string", "string", "string"],
  "stylingTips": ["string", "string", "string"]
}
`

    try {
      const text = await callGroq(prompt)
      const jsonData = extractJSON(text)
      if (jsonData) return jsonData
      throw new Error('No valid JSON found')
    } catch (error) {
      console.error('analyzeMeasurements error:', error)
      return {
        bodyType: programmaticResult.bodyType,
        recommendations: [
          'A-line Ankara dress with empire waist',
          'Wrap-style Ankara blouse',
          'High-waisted Ankara skirt'
        ],
        designCategories: ['A-line dresses', 'Wrap tops', 'High-waisted skirts'],
        fabricSuggestions: ['Cotton Ankara prints', 'Silk-blend Ankara', 'Lightweight cotton'],
        stylingTips: [
          'Choose prints that complement your skin tone',
          'Use accessories to balance proportions',
          'Consider the occasion when selecting print size',
          'Opt for tailored fits that highlight your best features',
          'Mix solid colors with Ankara prints for a balanced look'
        ]
      }
    }
  }

  static async getStyleRecommendations(preferences: {
    occasion: string
    bodyType: string
    colorPreferences?: string | string[]
    stylePreferences?: string | string[]
    budget?: string
  }): Promise<StyleRecommendation> {
    const formatPreferences = (prefs?: string | string[]): string => {
      if (!prefs) return ''
      if (Array.isArray(prefs)) return prefs.join(', ')
      return prefs
    }

    const basicTips = getBasicStylingTips(preferences.bodyType)

    const prompt = `
You are an expert Ankara fashion consultant specializing in African wax print styling.

PREFERENCES:
- Occasion: ${preferences.occasion}
- Body Type: ${preferences.bodyType}
${preferences.colorPreferences ? `- Color Preferences: ${formatPreferences(preferences.colorPreferences)}` : ''}
${preferences.stylePreferences ? `- Style Preferences: ${formatPreferences(preferences.stylePreferences)}` : ''}
${preferences.budget ? `- Budget: ${preferences.budget}` : ''}

BODY TYPE STYLING GUIDANCE:
- Goals: ${basicTips.goals.join(', ')}
- Do: ${basicTips.do.join(', ')}
- Avoid: ${basicTips.avoid.join(', ')}

Respond ONLY with valid JSON, no extra text:
{
  "occasion": "string",
  "designs": ["string", "string", "string"],
  "colors": ["string", "string", "string"],
  "accessories": ["string", "string", "string"],
  "stylingNotes": "string"
}
`

    try {
      const text = await callGroq(prompt)
      const jsonData = extractJSON(text)
      if (jsonData) return jsonData
      throw new Error('No valid JSON found')
    } catch (error) {
      console.error('getStyleRecommendations error:', error)
      return {
        occasion: preferences.occasion,
        designs: [
          'Elegant Ankara evening gown',
          'Professional Ankara blazer set',
          'Casual Ankara wrap dress'
        ],
        colors: [
          'Gold and black combination',
          'Red and white traditional',
          'Blue and green modern'
        ],
        accessories: ['Matching Ankara headwrap', 'Gold jewelry', 'Leather sandals'],
        stylingNotes: 'Choose designs that flatter your body type and match the formality of the occasion.'
      }
    }
  }

  static async generateStylingTips(design: string, bodyType: string): Promise<string[]> {
    const prompt = `
Provide 5 specific styling tips for wearing "${design}" for someone with a "${bodyType}" body type.
Focus on Ankara fashion and be specific about fit, accessories, and styling techniques.

Respond ONLY with valid JSON, no extra text:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`

    try {
      const text = await callGroq(prompt)
      const jsonData = extractJSON(text)
      if (jsonData?.tips) return jsonData.tips
      throw new Error('No valid JSON found')
    } catch (error) {
      console.error('generateStylingTips error:', error)
      return [
        'Ensure the fit is tailored to your body type',
        'Choose accessories that complement the Ankara print',
        'Consider the occasion when selecting styling details',
        'Pay attention to color coordination',
        'Experiment with different ways to wear the piece'
      ]
    }
  }

  static async generateOutfitImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    return {
      success: false,
      imageUrl: null,
      message: 'Image generation is not supported with the current AI provider.'
    }
  }
}
