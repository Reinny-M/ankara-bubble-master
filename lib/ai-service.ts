import { GoogleGenerativeAI } from '@google/generative-ai'
import { calculateBodyShape, getBasicStylingTips } from './body-shape-calculator'

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Model versions with fallback order (Updated to Gemini 2.5 - 2025)
const MODELS = [
  'gemini-2.5-pro',      // Primary: Most capable for complex analysis (Latest 2025)
  'gemini-2.5-flash',    // Fallback 1: Faster, lighter (Latest 2025)
  'gemini-1.5-pro'      // Fallback 2: Stable backup
] as const

type ModelName = typeof MODELS[number]

interface AIServiceConfig {
  temperature?: number
  maxOutputTokens?: number
  topP?: number
  topK?: number
}

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

export class AIService {
  private static async tryModel<T>(
    operation: (model: any) => Promise<T>,
    modelName: ModelName
  ): Promise<T> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      })
      return await operation(model)
    } catch (error) {
      console.error(`Model ${modelName} failed:`, error)
      throw error
    }
  }

  private static async executeWithFallback<T>(
    operation: (model: any) => Promise<T>
  ): Promise<T> {
    let lastError: Error | null = null

    for (const modelName of MODELS) {
      try {
        return await this.tryModel(operation, modelName)
      } catch (error) {
        lastError = error as Error
        // Model failed, trying next...
        continue
      }
    }

    throw new Error(`All models failed. Last error: ${lastError?.message}`)
  }

  static async analyzeMeasurements(measurements: {
    height: number
    bust: number
    waist: number
    hips: number
    age?: number
    gender?: string
  }): Promise<MeasurementAnalysis> {
    // Step 1: Programmatic pre-check
    const programmaticResult = calculateBodyShape({
      bust: measurements.bust,
      waist: measurements.waist,
      hips: measurements.hips,
      gender: measurements.gender
    })
    
    // Step 2: AI refinement with enhanced prompt
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
- Ratios: Bust/Waist: ${programmaticResult.measurements.bustWaistRatio.toFixed(2)}, Hip/Waist: ${programmaticResult.measurements.hipWaistRatio.toFixed(2)}
- Reasoning: ${programmaticResult.reasoning}

BODY TYPE DEFINITIONS (for validation):
- HOURGLASS: Bust and hips similar width, waist significantly smaller (25%+ smaller)
- PEAR: Hips wider than bust (5%+ difference), defined waist
- APPLE: Waist similar to or larger than bust/hips, fuller midsection
- RECTANGLE: Bust, waist, and hips similar width (within 5%)
- INVERTED TRIANGLE: Bust/shoulders wider than hips (5%+ difference)
- SPOON: Similar to pear but with more pronounced lower half
- DIAMOND: Waist is the widest part

TASK:
1. Validate or refine the programmatic body type classification
2. If you disagree, explain why and provide the correct body type
3. Provide 3-5 specific Ankara design recommendations for this body type
4. Suggest 3-5 design categories that work well
5. Recommend 3-5 fabric types for Ankara prints
6. Give 5 styling tips specific to this body type

Format your response as JSON with the following structure:
{
  "bodyType": "string",
  "bodyTypeReasoning": "string",
  "recommendations": ["string", "string", "string"],
  "designCategories": ["string", "string", "string"],
  "fabricSuggestions": ["string", "string", "string"],
  "stylingTips": ["string", "string", "string"]
}
`

    return await this.executeWithFallback(async (model) => {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        // Try multiple JSON extraction methods
        let jsonData = null
        
        // Method 1: Look for JSON object in response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0])
          } catch (e) {
            // JSON match found but failed to parse
          }
        }
        
        // Method 2: Look for JSON array
        if (!jsonData) {
          const arrayMatch = text.match(/\[[\s\S]*\]/)
          if (arrayMatch) {
            try {
              jsonData = JSON.parse(arrayMatch[0])
            } catch (e) {
              // Array match found but failed to parse
            }
          }
        }
        
        // Method 3: Try to extract structured data from text
        if (!jsonData) {
          const bodyTypeMatch = text.match(/bodyType["\s]*:["\s]*([^,}\n]+)/i)
          const recommendationsMatch = text.match(/recommendations["\s]*:["\s]*\[([^\]]+)\]/i)
          
          if (bodyTypeMatch) {
            jsonData = {
              bodyType: bodyTypeMatch[1].trim().replace(/['"]/g, ''),
              recommendations: recommendationsMatch ? 
                recommendationsMatch[1].split(',').map((r: string) => r.trim().replace(/['"]/g, '')) : 
                [
                  "A-line Ankara dress with empire waist",
                  "Wrap-style Ankara blouse",
                  "High-waisted Ankara skirt"
                ],
              designCategories: [
                "A-line dresses",
                "Wrap tops",
                "High-waisted skirts"
              ],
              fabricSuggestions: [
                "Cotton Ankara prints",
                "Silk-blend Ankara",
                "Lightweight cotton"
              ],
              stylingTips: [
                "Choose prints that complement your skin tone",
                "Use accessories to balance proportions",
                "Consider the occasion when selecting print size"
              ]
            }
          }
        }
        
        if (jsonData) {
          return jsonData
        }
        
        throw new Error('No valid JSON found in response')
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        // Return fallback response
        return {
          bodyType: programmaticResult.bodyType,
          recommendations: [
            "A-line Ankara dress with empire waist",
            "Wrap-style Ankara blouse",
            "High-waisted Ankara skirt"
          ],
          designCategories: [
            "A-line dresses",
            "Wrap tops",
            "High-waisted skirts"
          ],
          fabricSuggestions: [
            "Cotton Ankara prints",
            "Silk-blend Ankara",
            "Lightweight cotton"
          ],
          stylingTips: [
            "Choose prints that complement your skin tone",
            "Use accessories to balance proportions",
            "Consider the occasion when selecting print size"
          ]
        }
      }
    })
  }

  static async getStyleRecommendations(preferences: {
    occasion: string
    bodyType: string
    colorPreferences?: string | string[]
    stylePreferences?: string | string[]
    budget?: string
  }): Promise<StyleRecommendation> {
    // Helper function to convert string or array to comma-separated string
    const formatPreferences = (prefs?: string | string[]): string => {
      if (!prefs) return ''
      if (Array.isArray(prefs)) return prefs.join(', ')
      return prefs
    }

    // Get basic styling tips for the body type
    const basicTips = getBasicStylingTips(preferences.bodyType)
    
    const prompt = `
You are an expert Ankara fashion consultant specializing in African wax print styling. Based on the following preferences, provide personalized style recommendations:

PREFERENCES:
- Occasion: ${preferences.occasion}
- Body Type: ${preferences.bodyType}
${preferences.colorPreferences ? `- Color Preferences: ${formatPreferences(preferences.colorPreferences)}` : ''}
${preferences.stylePreferences ? `- Style Preferences: ${formatPreferences(preferences.stylePreferences)}` : ''}
${preferences.budget ? `- Budget: ${preferences.budget}` : ''}

BODY TYPE STYLING GUIDANCE FOR ${preferences.bodyType.toUpperCase()}:
- Goals: ${basicTips.goals.join(', ')}
- Do: ${basicTips.do.join(', ')}
- Avoid: ${basicTips.avoid.join(', ')}

TASK:
Provide detailed recommendations that:
1. Are specific to the ${preferences.occasion} occasion
2. Flatter the ${preferences.bodyType} body type
3. Incorporate Ankara print styling best practices
4. Include practical styling advice

Please provide:
1. 3-5 specific occasion-appropriate Ankara designs with detailed descriptions
2. 3-5 recommended color combinations for Ankara prints
3. 3-5 suggested accessories that complement the outfit
4. Detailed styling notes with specific tips for this body type and occasion

Format your response as JSON with the following structure:
{
  "occasion": "string",
  "designs": ["string", "string", "string"],
  "colors": ["string", "string", "string"],
  "accessories": ["string", "string", "string"],
  "stylingNotes": "string"
}
`

    return await this.executeWithFallback(async (model) => {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
        throw new Error('No JSON found in response')
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return {
          occasion: preferences.occasion,
          designs: [
            "Elegant Ankara evening gown",
            "Professional Ankara blazer",
            "Casual Ankara wrap dress"
          ],
          colors: [
            "Gold and black combination",
            "Red and white traditional",
            "Blue and green modern"
          ],
          accessories: [
            "Matching Ankara headwrap",
            "Gold jewelry",
            "Leather sandals"
          ],
          stylingNotes: "Choose designs that flatter your body type and match the formality of the occasion."
        }
      }
    })
  }

  static async generateStylingTips(design: string, bodyType: string): Promise<string[]> {
    const prompt = `
Provide 5 specific styling tips for wearing "${design}" for someone with a "${bodyType}" body type. 
Focus on Ankara fashion and be specific about fit, accessories, and styling techniques.

Return as a JSON array of strings:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`

    return await this.executeWithFallback(async (model) => {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return parsed.tips || []
        }
        throw new Error('No JSON found in response')
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return [
          "Ensure the fit is tailored to your body type",
          "Choose accessories that complement the Ankara print",
          "Consider the occasion when selecting styling details",
          "Pay attention to color coordination",
          "Experiment with different ways to wear the piece"
        ]
      }
    })
  }

  /**
   * Generate outfit visualization using Gemini's image generation capabilities
   * Based on the latest Gemini features including Nano Banana for image editing
   */
  static async generateOutfitImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const prompt = `
Create a professional fashion illustration of an Ankara (African wax print) outfit.

OUTFIT SPECIFICATIONS:
- Design: ${request.design}
- Body Type: ${request.bodyType}
- Occasion: ${request.occasion}
${request.colorPreferences ? `- Color Preferences: ${request.colorPreferences}` : ''}
${request.stylePreferences ? `- Style Preferences: ${request.stylePreferences}` : ''}

BODY MEASUREMENTS:
- Height: ${request.measurements.height}cm
- Bust: ${request.measurements.bust}cm
- Waist: ${request.measurements.waist}cm
- Hips: ${request.measurements.hips}cm

STYLING REQUIREMENTS:
- Use authentic Ankara/African wax print patterns with vibrant colors
- Ensure the outfit flatters the ${request.bodyType} body type
- Make it appropriate for ${request.occasion} occasion
- Show the outfit on a model with ${request.bodyType} proportions
- Include appropriate accessories (jewelry, shoes, handbag)
- Professional fashion illustration style
- High quality, detailed rendering
- Show the outfit from a flattering angle

TECHNICAL SPECIFICATIONS:
- High resolution fashion illustration (1024x1024 minimum)
- Clean, professional background
- Good lighting and shadows
- Detailed fabric texture showing Ankara print patterns
- Proper fit for the body type
- Fashion-forward styling
- Show the model in a confident pose

Please generate a high-quality fashion illustration that showcases this Ankara outfit design.
`

    return await this.executeWithFallback(async (model) => {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        // Try to extract image data from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const imageData = JSON.parse(jsonMatch[0])
          return {
            success: true,
            imageUrl: imageData.imageUrl || imageData.url || imageData.image,
            message: 'Outfit visualization generated successfully'
          }
        }
        
        // Fallback: return text response
        return {
          success: true,
          message: 'Image generation completed',
          imageUrl: null,
          rawResponse: text
        }
      } catch (parseError) {
        console.error('Failed to parse image generation response:', parseError)
        return {
          success: false,
          error: 'Failed to parse image generation response',
          message: 'Image generation completed but response parsing failed'
        }
      }
    })
  }
}
