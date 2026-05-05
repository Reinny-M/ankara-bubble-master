"use client"
import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle, AlertCircle, Eye, Camera, Upload, X } from "lucide-react"
import { useToast } from "@/components/toast-context"
import Link from "next/link"

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

interface PhotoMeasurements {
  bust: number
  waist: number
  hips: number
  estimatedHeight: number
  bodyType: string
  confidence: string
  notes: string
  suggestions: string[]
}

export default function ClientAIStylist() {
  const [step, setStep] = useState<'measurements' | 'preferences' | 'results'>('measurements')
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recommendationSaved, setRecommendationSaved] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({})
  const [inputMode, setInputMode] = useState<'manual' | 'photo'>('manual')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoMeasurements, setPhotoMeasurements] = useState<PhotoMeasurements | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [measurements, setMeasurements] = useState({
    height: '', bust: '', waist: '', hips: '', age: '', gender: ''
  })

  const [preferences, setPreferences] = useState({
    occasion: '', colorPreferences: '', stylePreferences: '', budget: ''
  })

  const [analysis, setAnalysis] = useState<MeasurementAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<StyleRecommendation | null>(null)

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePhotoAnalyze = async () => {
    if (!photoFile) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', photoFile)
      if (measurements.height) formData.append('height', measurements.height)
      const response = await fetch('/api/ai/extract-measurements-from-photo', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze photo')
      }
      const data = await response.json()
      const pm: PhotoMeasurements = data.data
      setPhotoMeasurements(pm)
      setMeasurements(prev => ({
        ...prev,
        bust: (pm.bust || 0).toString(),
        waist: (pm.waist || 0).toString(),
        hips: (pm.hips || 0).toString(),
        height: pm.estimatedHeight ? pm.estimatedHeight.toString() : prev.height,
      }))
      toast({ title: "Photo Analyzed!", description: `Body type detected: ${pm.bodyType} (${pm.confidence} confidence)` })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Photo Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleMeasurementsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ai/analyze-measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurements)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze measurements')
      }
      const data = await response.json()
      setAnalysis(data.data)
      setStep('preferences')
      toast({ title: "Analysis Complete!", description: `Your body type: ${data.data.bodyType}` })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ai/style-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, bodyType: analysis?.bodyType })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get recommendations')
      }
      const data = await response.json()
      setRecommendations(data.data)
      setStep('results')
      toast({ title: "Recommendations Ready!", description: "Your personalized style recommendations are ready." })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Recommendations Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImage = async (design: string) => {
    if (!analysis || !recommendations) return
    setImageLoading(design)
    setError(null)
    try {
      const response = await fetch('/api/ai/generate-outfit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design, bodyType: analysis.bodyType, occasion: preferences.occasion,
          colorPreferences: preferences.colorPreferences, stylePreferences: preferences.stylePreferences,
          measurements: {
            height: parseFloat(measurements.height), bust: parseFloat(measurements.bust),
            waist: parseFloat(measurements.waist), hips: parseFloat(measurements.hips),
          }
        })
      })
      if (!response.ok) throw new Error('Failed to generate image')
      const data = await response.json()
      setGeneratedImages(prev => ({ ...prev, [design]: data.imageUrl }))
      toast({ title: "Image Generated!", description: "Your outfit visualization is ready." })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Image Generation Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setImageLoading(null)
    }
  }

  const handleSaveRecommendation = async () => {
    if (!analysis || !recommendations) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ai/save-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          measurements: {
            height: parseFloat(measurements.height), bust: parseFloat(measurements.bust),
            waist: parseFloat(measurements.waist), hips: parseFloat(measurements.hips),
            age: measurements.age ? parseFloat(measurements.age) : undefined,
            gender: measurements.gender || undefined,
          },
          bodyType: analysis.bodyType, bodyTypeConfidence: 'ai-refined',
          occasion: preferences.occasion,
          colorPreferences: preferences.colorPreferences ? preferences.colorPreferences.split(',').map(s => s.trim()) : undefined,
          stylePreferences: preferences.stylePreferences ? preferences.stylePreferences.split(',').map(s => s.trim()) : undefined,
          budget: preferences.budget || undefined,
          designRecommendations: analysis.recommendations, designCategories: analysis.designCategories,
          fabricSuggestions: analysis.fabricSuggestions, stylingTips: analysis.stylingTips,
          recommendedDesigns: recommendations.designs.map(design => ({ name: design, description: design })),
          colorCombinations: recommendations.colors.map(color => ({ name: color, description: color })),
          accessories: recommendations.accessories.map(accessory => ({ name: accessory, description: accessory })),
          stylingNotes: recommendations.stylingNotes,
        })
      })
      if (!response.ok) throw new Error('Failed to save recommendation')
      const data = await response.json()
      toast({ title: data.isUpdate ? "Updated!" : "Saved!", description: data.message })
      setRecommendationSaved(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Save Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('measurements')
    setMeasurements({ height: '', bust: '', waist: '', hips: '', age: '', gender: '' })
    setPreferences({ occasion: '', colorPreferences: '', stylePreferences: '', budget: '' })
    setAnalysis(null)
    setRecommendations(null)
    setError(null)
    setRecommendationSaved(false)
    setGeneratedImages({})
    setPhotoPreview(null)
    setPhotoFile(null)
    setPhotoMeasurements(null)
    setInputMode('manual')
    setImageLoading(null)
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">AI Stylist</h1>
          <p className="text-stone-600 dark:text-stone-400">Get personalized Ankara fashion recommendations</p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          {['measurements', 'preferences', 'results'].map((s, i) => (
            <div key={s} className="flex items-center">
              {i > 0 && <div className="w-8 h-px bg-stone-200 mr-4"></div>}
              <div className={`flex items-center space-x-2 ${step === s ? 'text-orange-600' : 'text-stone-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-400'}`}>
                  {i + 1}
                </div>
                <span className="text-sm font-medium capitalize">{s}</span>
              </div>
            </div>
          ))}
        </div>

        {step === 'measurements' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <Sparkles className="h-5 w-5 text-orange-600" />
                Body Measurements
              </CardTitle>
              <CardDescription>Choose how to provide your measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Button type="button" variant={inputMode === 'manual' ? 'default' : 'outline'} onClick={() => setInputMode('manual')} className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />Enter Manually
                </Button>
                <Button type="button" variant={inputMode === 'photo' ? 'default' : 'outline'} onClick={() => setInputMode('photo')} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                  <Camera className="w-4 h-4 mr-2" />Use Photo (AI)
                </Button>
              </div>

              {inputMode === 'photo' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center space-y-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Preview" className="mx-auto max-h-64 rounded-lg object-contain" />
                        <button onClick={() => { setPhotoPreview(null); setPhotoFile(null); setPhotoMeasurements(null) }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="w-8 h-8 text-orange-600" />
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 text-sm">Take a full-body photo or upload one. AI will extract your measurements automatically.</p>
                        <div className="flex gap-3 justify-center">
                          <Button type="button" variant="outline" onClick={() => cameraInputRef.current?.click()}>
                            <Camera className="w-4 h-4 mr-2" />Take Photo
                          </Button>
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />Upload Photo
                          </Button>
                        </div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])} />
                    <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])} />
                  </div>

                  <div className="space-y-2">
                    <Label>Your Height (cm) - Optional but improves accuracy</Label>
                    <Input type="number" value={measurements.height} onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))} placeholder="e.g., 165" className="dark:bg-stone-800 dark:text-stone-100" />
                  </div>

                  {photoMeasurements && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-800 dark:text-green-200">Measurements Extracted!</h4>
                        <Badge variant="outline">{photoMeasurements.confidence} confidence</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-white dark:bg-stone-800 rounded">
                          <p className="text-stone-500">Bust</p>
                          <p className="font-bold text-orange-600">{photoMeasurements.bust}cm</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-stone-800 rounded">
                          <p className="text-stone-500">Waist</p>
                          <p className="font-bold text-orange-600">{photoMeasurements.waist}cm</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-stone-800 rounded">
                          <p className="text-stone-500">Hips</p>
                          <p className="font-bold text-orange-600">{photoMeasurements.hips}cm</p>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500">{photoMeasurements.notes}</p>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {photoFile && !photoMeasurements && (
                      <Button onClick={handlePhotoAnalyze} disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Photo...</> : <><Camera className="mr-2 h-4 w-4" />Analyze Photo</>}
                      </Button>
                    )}
                    {photoMeasurements && (
                      <Button onClick={handleMeasurementsSubmit} disabled={loading} className="flex-1">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : <><Sparkles className="mr-2 h-4 w-4" />Continue with These Measurements</>}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {inputMode === 'manual' && (
                <form onSubmit={handleMeasurementsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'height', label: 'Height (cm)', placeholder: 'e.g., 165', required: true },
                      { id: 'bust', label: 'Bust (cm)', placeholder: 'e.g., 90', required: true },
                      { id: 'waist', label: 'Waist (cm)', placeholder: 'e.g., 75', required: true },
                      { id: 'hips', label: 'Hips (cm)', placeholder: 'e.g., 95', required: true },
                      { id: 'age', label: 'Age (optional)', placeholder: 'e.g., 25', required: false },
                    ].map(field => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input id={field.id} type="number" value={measurements[field.id as keyof typeof measurements]}
                          onChange={(e) => setMeasurements(prev => ({ ...prev, [field.id]: e.target.value }))}
                          placeholder={field.placeholder} required={field.required}
                          className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Gender (optional)</Label>
                      <CustomSelect value={measurements.gender} onValueChange={(value) => setMeasurements(prev => ({ ...prev, gender: value }))}
                        placeholder="Select gender"
                        options={[{ value: "female", label: "Female" }, { value: "male", label: "Male" }, { value: "non-binary", label: "Non-binary" }]}
                        className="w-full" />
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span>
                    </div>
                  )}
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze My Body Type</>}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'preferences' && analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />Style Preferences
              </CardTitle>
              <CardDescription>Your body type: <Badge variant="secondary">{analysis.bodyType}</Badge></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Occasion</Label>
                    <CustomSelect value={preferences.occasion} onValueChange={(value) => setPreferences(prev => ({ ...prev, occasion: value }))}
                      placeholder="Select occasion"
                      options={[
                        { value: "casual", label: "Casual" }, { value: "business", label: "Business" },
                        { value: "formal", label: "Formal" }, { value: "party", label: "Party" },
                        { value: "wedding", label: "Wedding" }, { value: "church", label: "Church" },
                        { value: "office", label: "Office" }, { value: "date", label: "Date" },
                        { value: "cultural event", label: "Cultural Event" }
                      ]} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color Preferences (optional)</Label>
                    <Input value={preferences.colorPreferences} onChange={(e) => setPreferences(prev => ({ ...prev, colorPreferences: e.target.value }))} placeholder="e.g., Gold, Red, Blue" className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" />
                  </div>
                  <div className="space-y-2">
                    <Label>Style Preferences (optional)</Label>
                    <Input value={preferences.stylePreferences} onChange={(e) => setPreferences(prev => ({ ...prev, stylePreferences: e.target.value }))} placeholder="e.g., Modern, Traditional, Bold" className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget (optional)</Label>
                    <CustomSelect value={preferences.budget} onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
                      placeholder="Select budget range"
                      options={[
                        { value: "under-5000", label: "Under KES 5,000" },
                        { value: "5000-15000", label: "KES 5,000 - 15,000" },
                        { value: "15000-25000", label: "KES 15,000 - 25,000" },
                        { value: "25000-50000", label: "KES 25,000 - 50,000" },
                        { value: "over-50000", label: "Over KES 50,000" }
                      ]} className="w-full" />
                  </div>
                </div>
                {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"><AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span></div>}
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep('measurements')} className="flex-1">Back</Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Recommendations...</> : <><Sparkles className="mr-2 h-4 w-4" />Get My Style Recommendations</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'results' && analysis && recommendations && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Body Type Analysis</CardTitle>
                <CardDescription>AI-powered analysis of your measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">Body Type: {analysis.bodyType}</h4>
                {[
                  { label: 'Design Recommendations', items: analysis.recommendations, variant: 'outline' as const },
                  { label: 'Design Categories', items: analysis.designCategories, variant: 'secondary' as const },
                  { label: 'Fabric Suggestions', items: analysis.fabricSuggestions, variant: 'outline' as const },
                ].map(section => (
                  <div key={section.label}>
                    <h5 className="font-medium text-stone-800 dark:text-stone-200 mb-2">{section.label}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item, i) => <Badge key={i} variant={section.variant}>{item}</Badge>)}
                    </div>
                  </div>
                ))}
                <div>
                  <h5 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Styling Tips:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    {analysis.stylingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Style Recommendations</CardTitle>
                <CardDescription>Personalized suggestions for {recommendations.occasion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Recommended Designs', items: recommendations.designs, variant: 'default' as const },
                  { label: 'Color Combinations', items: recommendations.colors, variant: 'outline' as const },
                  { label: 'Accessories', items: recommendations.accessories, variant: 'secondary' as const },
                ].map(section => (
                  <div key={section.label}>
                    <h5 className="font-medium text-stone-800 dark:text-stone-200 mb-2">{section.label}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item, i) => <Badge key={i} variant={section.variant}>{item}</Badge>)}
                    </div>
                  </div>
                ))}
                <div>
                  <h5 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Styling Notes:</h5>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{recommendations.stylingNotes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />AI-Generated Outfit Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.designs.slice(0, 3).map((design, index) => (
                  <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-stone-900 dark:text-stone-100">{design}</h4>
                      <Button size="sm" variant="outline" onClick={() => handleGenerateImage(design)}
                        disabled={imageLoading === design}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50">
                        {imageLoading === design ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-1" />Generate</>}
                      </Button>
                    </div>
                    {generatedImages[design] && (
                      <img src={generatedImages[design]} alt={design}
                        className="w-full h-64 object-cover rounded-lg border border-stone-200 dark:border-stone-700 mt-3"
                        onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">Save Your Analysis</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Save to your profile for future reference</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {recommendationSaved && (
                      <Link href="/client/recommendations">
                        <Button variant="outline"><Eye className="w-4 h-4 mr-2" />View Saved</Button>
                      </Link>
                    )}
                    <Button onClick={handleSaveRecommendation} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4 mr-2" />Save Recommendation</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">Start Over</Button>
              <Button onClick={() => setStep('preferences')} className="flex-1">Modify Preferences</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
