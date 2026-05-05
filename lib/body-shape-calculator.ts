/**
 * Body Shape Calculator
 * 
 * This utility provides programmatic body shape analysis based on measurements.
 * It serves as a pre-check before AI refinement to ensure accurate body type detection.
 */

export interface BodyMeasurements {
  bust: number
  waist: number
  hips: number
  shoulders?: number
  gender?: string
}

export interface BodyShapeResult {
  bodyType: string
  confidence: 'high' | 'medium' | 'low'
  measurements: {
    bustWaistRatio: number
    hipWaistRatio: number
    shoulderHipRatio?: number
  }
  reasoning: string
}

/**
 * Calculate body shape based on measurements
 * Uses programmatic logic to determine body type before AI refinement
 */
export function calculateBodyShape(measurements: BodyMeasurements): BodyShapeResult {
  const { bust, waist, hips, shoulders, gender } = measurements
  
  // Calculate ratios
  const bustWaistRatio = bust / waist
  const hipWaistRatio = hips / waist
  const shoulderHipRatio = shoulders ? shoulders / hips : undefined
  
  // For women
  if (!gender || gender.toLowerCase() === 'female') {
    return calculateFemaleBodyShape({ bust, waist, hips, shoulders, bustWaistRatio, hipWaistRatio, shoulderHipRatio })
  }
  
  // For men
  return calculateMaleBodyShape({ bust, waist, hips, shoulders, bustWaistRatio, hipWaistRatio, shoulderHipRatio })
}

function calculateFemaleBodyShape({
  bust,
  waist,
  hips,
  shoulders,
  bustWaistRatio,
  hipWaistRatio,
  shoulderHipRatio
}: {
  bust: number
  waist: number
  hips: number
  shoulders?: number
  bustWaistRatio: number
  hipWaistRatio: number
  shoulderHipRatio?: number
}): BodyShapeResult {
  const bustHipDiff = Math.abs(bust - hips)
  const waistBustDiff = bust - waist
  const waistHipDiff = hips - waist
  
  // Hourglass: bust and hips within 5%, waist 25%+ smaller than both
  if (bustHipDiff <= bust * 0.05 && waist <= bust * 0.75 && waist <= hips * 0.75) {
    return {
      bodyType: 'Hourglass',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Bust and hips are similar width with significantly smaller waist (classic hourglass proportions)'
    }
  }
  
  // Pear: hips 5%+ larger than bust
  if (hips > bust * 1.05) {
    return {
      bodyType: 'Pear',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Hips are significantly wider than bust (bottom-heavy proportion)'
    }
  }
  
  // Apple: waist similar to or larger than hips, waist similar to bust
  if (waist >= hips * 0.95 && waist >= bust * 0.95) {
    return {
      bodyType: 'Apple',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Waist is similar to or larger than both bust and hips (apple shape)'
    }
  }
  
  // Rectangle: all measurements within 5%
  if (bustHipDiff <= bust * 0.05 && waistBustDiff < bust * 0.25 && waistHipDiff < hips * 0.25) {
    return {
      bodyType: 'Rectangle',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Bust, waist, and hips are all similar width (straight silhouette)'
    }
  }
  
  // Inverted Triangle: bust 5%+ larger than hips
  if (bust > hips * 1.05) {
    return {
      bodyType: 'Inverted Triangle',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Bust is significantly wider than hips (top-heavy proportion)'
    }
  }
  
  // Spoon: similar to pear but with more pronounced lower half
  if (hips > bust * 1.03 && waistHipDiff > bust * 0.15) {
    return {
      bodyType: 'Spoon',
      confidence: 'medium',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Hips wider than bust with defined waist (spoon shape)'
    }
  }
  
  // Diamond: waist is the widest part
  if (waist > bust && waist > hips) {
    return {
      bodyType: 'Diamond',
      confidence: 'medium',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Waist is wider than both bust and hips (diamond shape)'
    }
  }
  
  // Default to balanced if no clear pattern
  return {
    bodyType: 'Rectangle',
    confidence: 'low',
    measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
    reasoning: 'Measurements don\'t fit standard body type patterns - may be a combination or unique shape'
  }
}

function calculateMaleBodyShape({
  bust,
  waist,
  hips,
  shoulders,
  bustWaistRatio,
  hipWaistRatio,
  shoulderHipRatio
}: {
  bust: number
  waist: number
  hips: number
  shoulders?: number
  bustWaistRatio: number
  hipWaistRatio: number
  shoulderHipRatio?: number
}): BodyShapeResult {
  const bustHipDiff = Math.abs(bust - hips)
  const waistBustDiff = bust - waist
  const waistHipDiff = hips - waist
  
  // Rectangle: shoulders, waist, and hips similar width
  if (bustHipDiff <= bust * 0.05 && waistBustDiff < bust * 0.15 && waistHipDiff < hips * 0.15) {
    return {
      bodyType: 'Male Rectangle',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Shoulders, waist, and hips are similar width (rectangular silhouette)'
    }
  }
  
  // Triangle: hips/waist wider than shoulders
  if (hips > bust * 1.05 || waist > bust * 1.05) {
    return {
      bodyType: 'Male Triangle',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Hips or waist are wider than shoulders (bottom-heavy proportion)'
    }
  }
  
  // Inverted Triangle: shoulders/bust wider than hips
  if (bust > hips * 1.05) {
    return {
      bodyType: 'Male Inverted Triangle',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Shoulders/bust are wider than hips (top-heavy proportion)'
    }
  }
  
  // Oval: waist is the widest part
  if (waist > bust && waist > hips) {
    return {
      bodyType: 'Oval',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Waist is wider than both shoulders and hips (oval shape)'
    }
  }
  
  // Trapezoid: shoulders wider than waist, waist wider than hips
  if (shoulders && shoulders > waist && waist > hips) {
    return {
      bodyType: 'Trapezoid',
      confidence: 'high',
      measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
      reasoning: 'Shoulders > waist > hips (classic athletic build)'
    }
  }
  
  // Default to balanced if no clear pattern
  return {
    bodyType: 'Rectangle',
    confidence: 'low',
    measurements: { bustWaistRatio, hipWaistRatio, shoulderHipRatio },
    reasoning: 'Measurements don\'t fit standard male body type patterns - may be a combination or unique shape'
  }
}

/**
 * Get styling recommendations based on body type
 * This provides basic styling guidance that can be enhanced by AI
 */
export function getBasicStylingTips(bodyType: string, gender?: string): {
  goals: string[]
  do: string[]
  avoid: string[]
} {
  const tips: Record<string, { goals: string[], do: string[], avoid: string[] }> = {
    // Female body types
    'Hourglass': {
      goals: ['Highlight natural curves', 'Define the waist', 'Balance proportions'],
      do: ['Wear fitted clothing', 'Use belts to define waist', 'Choose V-neck tops', 'Opt for high-waisted bottoms'],
      avoid: ['Boxy or shapeless clothing', 'Low-rise pants', 'Tops that hide the waist']
    },
    'Pear': {
      goals: ['Balance lower body', 'Draw attention upward', 'Create shoulder width'],
      do: ['Wear structured tops', 'Choose A-line skirts', 'Use shoulder pads', 'Wear darker bottoms'],
      avoid: ['Skinny jeans', 'Tight tops', 'Clothing that emphasizes hips']
    },
    'Apple': {
      goals: ['Create vertical lines', 'Define waist subtly', 'Draw attention to face'],
      do: ['Wear empire waist tops', 'Choose V-neck styles', 'Use vertical patterns', 'Wear structured jackets'],
      avoid: ['Tight waistbands', 'Crop tops', 'Horizontal stripes at waist']
    },
    'Rectangle': {
      goals: ['Create curves', 'Add definition', 'Create waist illusion'],
      do: ['Wear peplum tops', 'Use belts', 'Choose ruffled details', 'Wear high-waisted styles'],
      avoid: ['Boxy clothing', 'Straight-cut dresses', 'Clothing that hides shape']
    },
    'Inverted Triangle': {
      goals: ['Balance shoulders', 'Add lower body volume', 'Create waist definition'],
      do: ['Wear A-line skirts', 'Choose wide-leg pants', 'Use waist belts', 'Wear darker tops'],
      avoid: ['Shoulder pads', 'Wide necklines', 'Clothing that emphasizes shoulders']
    },
    'Spoon': {
      goals: ['Balance lower body', 'Create shoulder width', 'Define waist'],
      do: ['Wear structured tops', 'Choose A-line skirts', 'Use shoulder details', 'Wear darker bottoms'],
      avoid: ['Skinny bottoms', 'Tight tops', 'Clothing that emphasizes hips']
    },
    'Diamond': {
      goals: ['Create waist definition', 'Balance proportions', 'Draw attention to face'],
      do: ['Wear empire waist tops', 'Choose A-line styles', 'Use V-necks', 'Wear structured jackets'],
      avoid: ['Tight waistbands', 'Clothing that emphasizes midsection', 'Horizontal lines at waist']
    },
    
    // Male body types
    'Male Rectangle': {
      goals: ['Create shoulder width', 'Add waist definition', 'Create visual interest'],
      do: ['Wear structured blazers', 'Use layering', 'Choose horizontal patterns', 'Wear fitted clothing'],
      avoid: ['Boxy clothing', 'Loose fits', 'Clothing that hides shape']
    },
    'Male Triangle': {
      goals: ['Broaden shoulders', 'Balance lower body', 'Create upper body width'],
      do: ['Wear structured jackets', 'Choose V-neck tops', 'Use shoulder padding', 'Wear darker bottoms'],
      avoid: ['Skinny fits', 'Clothing that emphasizes hips', 'Tight waistbands']
    },
    'Male Inverted Triangle': {
      goals: ['Minimize upper bulk', 'Add lower body volume', 'Create balance'],
      do: ['Wear slim-fit tops', 'Choose wide-leg pants', 'Use lighter colors on top', 'Wear structured bottoms'],
      avoid: ['Shoulder padding', 'Wide necklines', 'Clothing that emphasizes shoulders']
    },
    'Oval': {
      goals: ['Create vertical lines', 'Streamline silhouette', 'Draw attention upward'],
      do: ['Wear vertical patterns', 'Choose structured jackets', 'Use V-necks', 'Wear darker colors'],
      avoid: ['Tight waistbands', 'Horizontal patterns', 'Clothing that emphasizes midsection']
    },
    'Trapezoid': {
      goals: ['Highlight proportions', 'Maintain balance', 'Showcase athletic build'],
      do: ['Wear fitted clothing', 'Choose classic cuts', 'Use structured pieces', 'Wear tailored styles'],
      avoid: ['Loose clothing', 'Baggy fits', 'Clothing that hides shape']
    },
    
    // Default
    'Balanced': {
      goals: ['Maintain proportions', 'Highlight best features', 'Create personal style'],
      do: ['Wear well-fitted clothing', 'Choose flattering colors', 'Use accessories', 'Experiment with styles'],
      avoid: ['Ill-fitting clothing', 'Colors that wash you out', 'Trends that don\'t suit you']
    }
  }
  
  return tips[bodyType] || tips['Rectangle']
}
