"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { Search, Heart, Filter, ArrowLeft, Sparkles, ChevronRight, Home } from "lucide-react"
import Image from "next/image"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"

interface Design {
  _id: string
  id: string
  name: string
  fabric: string
  occasion: string
  price: string
  image?: string
  tailorId: string
  createdAt: number
  updatedAt: number
}

function ExploreDesignsContent() {
  const { user, isLoaded } = useUser()
  
  // Get designs from Convex
  const designs = useQuery(api.designs.getDesigns, {})
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-stone-200/50 dark:ring-stone-700/50 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-200/60 dark:border-stone-700/60 animate-fade-in-up animation-delay-100">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="sm" variant="full" />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link
                href="/"
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-2"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-2"
              >
                Pricing
              </Link>
              <Link href="/explore/designs" className="flex items-center gap-2 font-semibold text-orange-600">
                Explore
                <ChevronRight className="w-4 h-4" />
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {isLoaded && user ? (
                <>
                  <Link href={`/${user.unsafeMetadata?.role || 'client'}/dashboard`}>
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-10 py-8">
            {/* Breadcrumb */}
            <nav className="uppercase animate-fade-in-up animation-delay-200 text-xs text-stone-500 dark:text-stone-400 tracking-wider font-mono mb-6 space-x-2">
              <Link href="/" className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1">
                <Home className="w-3 h-3" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3 inline" />
              <span className="text-orange-600">Explore Designs</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-8 animate-fade-in-up animation-delay-300">
              <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-orange-600">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="mb-2 text-4xl font-bold text-stone-900 dark:text-stone-100">Explore Designs</h1>
              <p className="text-stone-600 dark:text-stone-400">
                Discover beautiful Ankara fashion designs from talented tailors
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input 
                  placeholder="Search designs by style, occasion, or fabric..." 
                  className="pl-9 bg-white dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700" 
                />
              </div>
              <Button variant="outline" className="bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Category Badges */}
            <div className="mb-6 flex flex-wrap gap-2 animate-fade-in-up animation-delay-500">
              <Badge variant="secondary" className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900 dark:bg-stone-700 dark:text-stone-200">
                All Designs
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 dark:border-stone-600 dark:text-stone-300">
                Formal Events
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 dark:border-stone-600 dark:text-stone-300">
                Casual Wear
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 dark:border-stone-600 dark:text-stone-300">
                Traditional
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 dark:border-stone-600 dark:text-stone-300">
                Modern Fusion
              </Badge>
            </div>

            {/* Designs Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up animation-delay-600">
              {designs === undefined ? (
                // Loading state
                Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <div className="relative aspect-[3/4] bg-stone-200 dark:bg-stone-700 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                      <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
                      <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/3" />
                    </div>
                  </Card>
                ))
              ) : designs.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <div className="text-stone-400 dark:text-stone-500 mb-4">
                    <Sparkles className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-stone-600 dark:text-stone-400">No designs available</h3>
                    <p className="text-stone-500 dark:text-stone-500">Check back later for new designs from our talented tailors.</p>
                  </div>
                </div>
              ) : (
                designs.map((design: Design) => (
                <Card key={design.id} className="overflow-hidden transition-all hover:shadow-lg border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                  <div className="relative aspect-[3/4]">
                    <Image src={design.image || "/placeholder.svg"} alt={design.name} fill className="object-cover" />
                    <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-orange-600 hover:text-white">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold text-stone-900 dark:text-stone-100">{design.name}</h3>
                    <p className="mb-2 text-xs text-stone-600 dark:text-stone-400">{design.fabric}</p>
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs dark:bg-stone-700 dark:text-stone-200">
                        {design.occasion}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600">{design.price}</span>
                      <Button size="sm" variant="ghost" className="dark:text-stone-300 dark:hover:text-orange-400">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center animate-fade-in-up animation-delay-700">
              <p className="mb-4 text-stone-600 dark:text-stone-400">Want personalized recommendations?</p>
              <Link href="/signup">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try AI Stylist
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function ExploreDesignsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700">
        <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-stone-200/50 dark:ring-stone-700/50 overflow-hidden animate-fade-in-up">
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-200/60 dark:border-stone-700/60 animate-fade-in-up animation-delay-100">
              <div className="h-8 w-32 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
              <div className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            </header>
            <main className="px-4 sm:px-6 lg:px-10 py-8">
              <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mb-6 animate-pulse" />
              <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded mb-8 animate-pulse" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <div className="relative aspect-[3/4] bg-stone-200 dark:bg-stone-700 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                      <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
                      <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/3" />
                    </div>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return <ExploreDesignsContent />
}
