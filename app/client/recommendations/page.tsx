"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CardSkeleton } from "@/components/loading/CardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar, User, Eye, Trash2, Sparkles, TrendingUp, Heart, Star,
  Ruler, Palette, ShoppingBag, ChevronDown, ChevronUp, Filter
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
  recommendedDesigns: Array<{ name: string; description: string }>
  colorCombinations: Array<{ name: string; description: string }>
  accessories: Array<{ name: string; description: string }>
  stylingNotes: string
  createdAt: number
  updatedAt: number
}

const bodyTypeConfig: Record<string, { color: string; emoji: string; bg: string }> = {
  'Hourglass': { color: 'text-pink-700 dark:text-pink-300', bg: 'bg-pink-100 dark:bg-pink-900/30', emoji: '⌛' },
  'Pear': { color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/30', emoji: '🍐' },
  'Apple': { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30', emoji: '🍎' },
  'Rectangle': { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '▬' },
  'Inverted Triangle': { color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', emoji: '▽' },
  'Spoon': { color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30', emoji: '🥄' },
  'Diamond': { color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/30', emoji: '💎' },
}

const occasionColors: Record<string, string> = {
  'wedding': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'casual': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'formal': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  'party': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'office': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'church': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'business': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

export default function SavedRecommendations() {
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterOccasion, setFilterOccasion] = useState<string>('all')
  const { toast } = useToast()

  useEffect(() => { fetchRecommendations() }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/get-recommendations')
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({ title: "Failed to Load", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/ai/delete-recommendation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: id })
      })
      if (!response.ok) throw new Error('Failed to delete')
      setRecommendations(prev => prev.filter(r => r._id !== id))
      toast({ title: "Deleted!", description: "Recommendation removed successfully." })
    } catch (err) {
      toast({ title: "Delete Failed", description: "Could not delete recommendation.", variant: "destructive" })
    }
  }

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  const getBodyTypeConfig = (bodyType: string) =>
    bodyTypeConfig[bodyType] || { color: 'text-stone-700 dark:text-stone-300', bg: 'bg-stone-100 dark:bg-stone-800', emoji: '👤' }

  const occasions = ['all', ...new Set(recommendations.map(r => r.occasion))]
  const filtered = filterOccasion === 'all' ? recommendations : recommendations.filter(r => r.occasion === filterOccasion)

  if (loading) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Style Library</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} titleLines={1} contentLines={3} height="h-48" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Style Library</h1>
            <p className="text-stone-600 dark:text-stone-400 mt-1">Your personalized AI fashion analyses</p>
          </div>
          <Link href="/client/ai-stylist">
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Heart, label: "Total Analyses", value: recommendations.length, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
            { icon: User, label: "Body Types", value: new Set(recommendations.map(r => r.bodyType)).size, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
            { icon: ShoppingBag, label: "Occasions", value: new Set(recommendations.map(r => r.occasion)).size, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { icon: Star, label: "Designs Saved", value: recommendations.reduce((acc, r) => acc + r.recommendedDesigns.length, 0), color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {recommendations.length === 0 ? (
          <Card className="border-dashed border-2 border-stone-200 dark:border-stone-700">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">Start Your Style Journey</h3>
              <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto leading-relaxed">
                Get your first AI stylist analysis. Upload a photo or enter your measurements and receive personalized Ankara fashion recommendations.
              </p>
              <Link href="/client/ai-stylist">
                <Button className="bg-orange-600 hover:bg-orange-700 rounded-full px-8">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get My First Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-sm text-stone-500">Filter by occasion:</span>
              {occasions.map(occasion => (
                <button key={occasion}
                  onClick={() => setFilterOccasion(occasion)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filterOccasion === occasion ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-orange-100'}`}>
                  {occasion === 'all' ? 'All' : occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                </button>
              ))}
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {filtered.map((rec) => {
                const bodyConfig = getBodyTypeConfig(rec.bodyType)
                const isExpanded = expandedId === rec._id
                const occasionColor = occasionColors[rec.occasion] || 'bg-stone-100 text-stone-700'

                return (
                  <Card key={rec._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800">
                    {/* Card Header Strip */}
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Body Type Badge */}
                          <div className={`w-14 h-14 ${bodyConfig.bg} rounded-2xl flex flex-col items-center justify-center flex-shrink-0`}>
                            <span className="text-2xl">{bodyConfig.emoji}</span>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${bodyConfig.bg} ${bodyConfig.color}`}>
                                {rec.bodyType}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColor}`}>
                                {rec.occasion}
                              </span>
                              {rec.bodyTypeConfidence === 'ai-refined' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 font-medium">
                                  ✨ AI Enhanced
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-stone-900 dark:text-stone-100">
                              {rec.bodyType} Body — {rec.occasion.charAt(0).toUpperCase() + rec.occasion.slice(1)} Occasion
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-xs text-stone-500 dark:text-stone-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(rec.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Ruler className="w-3 h-3" />
                                {rec.measurements.height}cm · B{rec.measurements.bust} W{rec.measurements.waist} H{rec.measurements.hips}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="ghost"
                            onClick={() => setExpandedId(isExpanded ? null : rec._id)}
                            className="text-stone-600 hover:text-orange-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                          <DeleteConfirmationDialog
                            onConfirm={() => handleDelete(rec._id)}
                            title="Delete Recommendation"
                            description={`Delete this ${rec.bodyType} analysis?`}
                            trigger={
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </CardHeader>

                    {/* Quick Preview */}
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {rec.designRecommendations.slice(0, 3).map((design, i) => (
                          <div key={i} className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-2 text-center">
                            <p className="text-xs font-medium text-orange-700 dark:text-orange-300 truncate">{design}</p>
                          </div>
                        ))}
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 space-y-6 border-t border-stone-100 dark:border-stone-800 pt-4">
                          {/* Measurements */}
                          <div>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-orange-600" /> Measurements
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { label: 'Height', value: `${rec.measurements.height}cm` },
                                { label: 'Bust', value: `${rec.measurements.bust}cm` },
                                { label: 'Waist', value: `${rec.measurements.waist}cm` },
                                { label: 'Hips', value: `${rec.measurements.hips}cm` },
                              ].map((m, i) => (
                                <div key={i} className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3 text-center">
                                  <p className="text-lg font-bold text-orange-600">{m.value}</p>
                                  <p className="text-xs text-stone-500">{m.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Design Categories */}
                          <div>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-orange-600" /> Recommended Designs
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {rec.recommendedDesigns.map((d, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{d.name}</Badge>
                              ))}
                            </div>
                          </div>

                          {/* Fabric & Colors */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-orange-600" /> Fabrics
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {rec.fabricSuggestions.map((f, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">Colors</h4>
                              <div className="flex flex-wrap gap-1">
                                {rec.colorCombinations.map((c, i) => (
                                  <Badge key={i} className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200">{c.name}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Styling Tips */}
                          <div>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-orange-600" /> Styling Tips
                            </h4>
                            <ul className="space-y-1">
                              {rec.stylingTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Styling Notes */}
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-2">Styling Notes</h4>
                            <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">{rec.stylingNotes}</p>
                          </div>

                          <div className="flex gap-3">
                            <Link href="/client/ai-stylist" className="flex-1">
                              <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-full">
                                <Sparkles className="w-4 h-4 mr-2" />
                                New Analysis
                              </Button>
                            </Link>
                            <Link href="/client/tailors" className="flex-1">
                              <Button variant="outline" className="w-full rounded-full">
                                Find a Tailor
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
