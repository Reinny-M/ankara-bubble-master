"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CardSkeleton } from "@/components/loading/CardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Calendar, 
  User, 
  Sparkles, 
  Clock,
  TrendingUp,
  Heart,
  Star,
  Trash2,
  Download,
  Share2
} from "lucide-react"
import { useToast } from "@/components/toast-context"
import Link from "next/link"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

interface SavedRecommendation {
  _id: string
  _creationTime: number
  measurements: {
    height: number
    bust: number
    waist: number
    hips: number
    age?: number
    gender?: string
  }
  bodyType: string
  bodyTypeConfidence: string
  occasion: string
  colorPreferences?: string[]
  stylePreferences?: string[]
  budget?: string
  designRecommendations: string[]
  designCategories: string[]
  fabricSuggestions: string[]
  stylingTips: string[]
  recommendedDesigns: Array<{
    name: string
    description: string
  }>
  colorCombinations: Array<{
    name: string
    description: string
  }>
  accessories: Array<{
    name: string
    description: string
  }>
  stylingNotes: string
  createdAt: number
  updatedAt: number
}

export default function RecommendationDetail() {
  const params = useParams()
  const router = useRouter()
  const [recommendation, setRecommendation] = useState<SavedRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchRecommendation(params.id as string)
    }
  }, [params.id])

  const fetchRecommendation = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ai/get-recommendation/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendation')
      }

      const data = await response.json()
      setRecommendation(data.recommendation)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({
        title: "Failed to Load Recommendation",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecommendation = async () => {
    if (!recommendation) return

    try {
      const response = await fetch(`/api/ai/delete-recommendation`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: recommendation._id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete recommendation')
      }

      toast({
        title: "Recommendation Deleted",
        description: "Your analysis has been removed from your saved recommendations.",
      })
      
      router.push('/client/recommendations')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBodyTypeColor = (bodyType: string) => {
    const colors: Record<string, string> = {
      'Hourglass': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'Pear': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Apple': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Rectangle': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Inverted Triangle': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Spoon': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Diamond': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Male Rectangle': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Male Triangle': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Male Inverted Triangle': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      'Oval': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'Trapezoid': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Balanced': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
    return colors[bodyType] || colors['Balanced']
  }

  if (loading) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Recommendation Details</h1>
              <p className="text-stone-600 dark:text-stone-400 mt-2">
                Loading your saved analysis...
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <CardSkeleton titleLines={1} contentLines={4} height="h-32" />
            <CardSkeleton titleLines={1} contentLines={3} height="h-40" />
            <CardSkeleton titleLines={1} contentLines={2} height="h-32" />
            <CardSkeleton titleLines={1} contentLines={3} height="h-48" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !recommendation) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Recommendation Details</h1>
              <p className="text-stone-600 dark:text-stone-400 mt-2">
                {error || 'Recommendation not found'}
              </p>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <TrendingUp className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Failed to Load Recommendation
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {error || 'The requested recommendation could not be found.'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => fetchRecommendation(params.id as string)} variant="outline">
                  Try Again
                </Button>
                <Link href="/client/recommendations">
                  <Button variant="outline">
                    View All Recommendations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                {recommendation.bodyType} Analysis
              </h1>
              <p className="text-stone-600 dark:text-stone-400 mt-2">
                Created on {formatDate(recommendation.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <DeleteConfirmationDialog
              onConfirm={handleDeleteRecommendation}
              title="Delete Recommendation"
              description={`Are you sure you want to delete this ${recommendation.bodyType} analysis for ${recommendation.occasion}? This action cannot be undone.`}
              trigger={
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              }
            />
          </div>
        </div>

        {/* Analysis Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Body Type Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                Body Type Analysis
              </CardTitle>
              <CardDescription>
                AI-powered analysis of your measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={getBodyTypeColor(recommendation.bodyType)}>
                  {recommendation.bodyType}
                </Badge>
                <Badge variant="outline" className="dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700">
                  {recommendation.bodyTypeConfidence === 'ai-refined' ? 'AI Enhanced' : 'Programmatic'}
                </Badge>
                <Badge variant="secondary">
                  {recommendation.occasion}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">Measurements</h4>
                  <div className="space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    <p>Height: {recommendation.measurements.height}cm</p>
                    <p>Bust: {recommendation.measurements.bust}cm</p>
                    <p>Waist: {recommendation.measurements.waist}cm</p>
                    <p>Hips: {recommendation.measurements.hips}cm</p>
                    {recommendation.measurements.age && (
                      <p>Age: {recommendation.measurements.age} years</p>
                    )}
                    {recommendation.measurements.gender && (
                      <p>Gender: {recommendation.measurements.gender}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">Preferences</h4>
                  <div className="space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    {recommendation.colorPreferences && (
                      <p>Colors: {recommendation.colorPreferences.join(', ')}</p>
                    )}
                    {recommendation.stylePreferences && (
                      <p>Styles: {recommendation.stylePreferences.join(', ')}</p>
                    )}
                    {recommendation.budget && (
                      <p>Budget: {recommendation.budget}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {recommendation.designRecommendations.length}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Design Recommendations
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {recommendation.fabricSuggestions.length}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Fabric Suggestions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {recommendation.stylingTips.length}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Styling Tips
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Design Recommendations</CardTitle>
            <CardDescription>
              Personalized Ankara designs for your {recommendation.bodyType} body type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {recommendation.designRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                    </div>
                    <h4 className="font-medium text-stone-900 dark:text-stone-100">{rec}</h4>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Design Categories & Fabrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recommendation.designCategories.map((category, index) => (
                  <Badge key={index} variant="outline" className="dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700">{category}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fabric Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recommendation.fabricSuggestions.map((fabric, index) => (
                  <Badge key={index} variant="secondary">{fabric}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Style Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Style Recommendations</CardTitle>
            <CardDescription>
              Complete styling guide for {recommendation.occasion} occasion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recommended Designs */}
            <div>
              <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-3">Recommended Designs</h4>
              <div className="space-y-3">
                {recommendation.recommendedDesigns.map((design, index) => (
                  <div key={index} className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                    <h5 className="font-medium text-stone-900 dark:text-stone-100">{design.name}</h5>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{design.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Combinations */}
            <div>
              <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-3">Color Combinations</h4>
              <div className="space-y-3">
                {recommendation.colorCombinations.map((color, index) => (
                  <div key={index} className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                    <h5 className="font-medium text-stone-900 dark:text-stone-100">{color.name}</h5>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{color.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-3">Accessories</h4>
              <div className="space-y-3">
                {recommendation.accessories.map((accessory, index) => (
                  <div key={index} className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                    <h5 className="font-medium text-stone-900 dark:text-stone-100">{accessory.name}</h5>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{accessory.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Styling Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Styling Tips</CardTitle>
            <CardDescription>
              Expert advice for your {recommendation.bodyType} body type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendation.stylingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Styling Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Styling Notes</CardTitle>
            <CardDescription>
              Comprehensive styling guide for your personalized look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap break-words max-w-full overflow-wrap-anywhere">
                {recommendation.stylingNotes}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
