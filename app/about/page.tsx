"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { ChevronRight, Home, Sparkles, Users, Award, Shield } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function AboutPage() {
  const { user, isLoaded } = useUser()
  
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
              <span className="text-orange-600">About</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                About Ankara Bubble
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Connecting the vibrant world of Ankara fashion with skilled tailors and passionate clients.
              </p>
            </div>

            {/* Mission Section */}
            <div className="mb-12 animate-fade-in-up animation-delay-400">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Our Mission</h2>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    We're revolutionizing African fashion by connecting talented tailors with clients who appreciate 
                    authentic Ankara designs. Our AI-powered platform makes it easier than ever to find the perfect 
                    tailor and get personalized style recommendations.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Our Vision</h2>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    To become the leading platform for African fashion, empowering both tailors and clients to 
                    create beautiful, authentic Ankara designs while preserving and celebrating African cultural heritage.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mb-12 animate-fade-in-up animation-delay-500">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">500+</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">Verified Tailors</div>
                </div>
                <div className="text-center p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">10K+</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">Designs Created</div>
                </div>
                <div className="text-center p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">98%</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">Success Rate</div>
                </div>
                <div className="text-center p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">24/7</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">AI Support</div>
                </div>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="text-center animate-fade-in-up animation-delay-600">
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">More About Us Coming Soon</h3>
                <p className="text-stone-600 dark:text-stone-400">
                  We're working on bringing you more detailed information about our story, team, and values. 
                  Stay tuned for updates!
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}