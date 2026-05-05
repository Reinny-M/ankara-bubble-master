"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { ChevronRight, Home, UserCircle, Sparkles, Users, ShoppingBag, CheckCircle } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function HowItWorks() {
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
              <span className="text-orange-600">How It Works</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-16 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                How It Works
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
                Get your perfect Ankara outfit in four simple steps
              </p>
            </div>

            {/* Steps */}
            <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-400">
              {[
                {
                  icon: UserCircle,
                  title: "Create Account",
                  description: "Sign up as a client or tailor in seconds",
                  step: "1",
                },
                {
                  icon: Sparkles,
                  title: "AI Analysis",
                  description: "Get personalized design recommendations",
                  step: "2",
                },
                {
                  icon: Users,
                  title: "Choose Tailor",
                  description: "Browse and select from expert tailors",
                  step: "3",
                },
                {
                  icon: ShoppingBag,
                  title: "Place Order",
                  description: "Order your custom Ankara outfit",
                  step: "4",
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Card key={i} className="relative overflow-hidden border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                      <span className="font-mono text-xl font-bold text-orange-600">{item.step}</span>
                    </div>
                    <CardHeader className="pt-8">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-stone-900 dark:text-stone-100">{item.title}</CardTitle>
                      <CardDescription className="text-stone-600 dark:text-stone-400">{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {/* For Clients */}
            <Card className="mb-16 border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm animate-fade-in-up animation-delay-500">
              <CardHeader>
                <CardTitle className="text-2xl text-stone-900 dark:text-stone-100">For Clients</CardTitle>
                <CardDescription className="text-stone-600 dark:text-stone-400">Discover your perfect Ankara style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Upload your photo and preferences to our AI stylist",
                  "Receive personalized design recommendations based on your body type and style",
                  "Browse verified tailors with ratings and portfolios",
                  "Place orders and track progress in real-time",
                  "Receive your custom-made Ankara outfit",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                    <p className="text-stone-700 dark:text-stone-300">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* For Tailors */}
            <Card className="mb-16 border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm animate-fade-in-up animation-delay-600">
              <CardHeader>
                <CardTitle className="text-2xl text-stone-900 dark:text-stone-100">For Tailors</CardTitle>
                <CardDescription className="text-stone-600 dark:text-stone-400">Grow your Ankara fashion business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Create your professional profile and showcase your portfolio",
                  "Get matched with clients looking for your expertise",
                  "Manage orders through an intuitive dashboard",
                  "Track earnings and analytics",
                  "Build your reputation with client reviews",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                    <p className="text-stone-700 dark:text-stone-300">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-center text-white sm:p-12 animate-fade-in-up animation-delay-700">
              <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg text-orange-50">Join thousands of fashion enthusiasts and expert tailors</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full bg-white text-orange-600 hover:bg-stone-50 sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white hover:bg-orange-600 sm:w-auto bg-transparent"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
