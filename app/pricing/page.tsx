"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { Check, ChevronRight, Home, DollarSign, Users, Shield, CreditCard } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function Pricing() {
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
                href="/help"
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-2"
              >
                Help
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
              <span className="text-orange-600">Pricing</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-16 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Simple Pricing
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
                Transparent pricing for clients and tailors
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mb-16 grid gap-8 md:grid-cols-2 animate-fade-in-up animation-delay-400">
              {/* Client Card */}
              <div className="group space-y-6 p-8 rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 dark:border-stone-700 dark:hover:border-orange-600 dark:bg-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">For Clients</h3>
                </div>
                <p className="text-stone-600 dark:text-stone-400">Browse and order with confidence</p>
                
                <div>
                  <div className="mb-2 text-4xl font-bold text-stone-900 dark:text-stone-100">Free</div>
                  <p className="text-stone-600 dark:text-stone-400">No subscription fees</p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Free account creation",
                    "Unlimited AI style recommendations",
                    "Browse all tailors and designs",
                    "Secure payment processing",
                    "Order tracking and support",
                    "Save favorite designs",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                      <span className="text-stone-700 dark:text-stone-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Tailor Card */}
              <div className="group space-y-6 p-8 rounded-xl border-2 border-orange-600 hover:border-orange-500 hover:shadow-lg transition-all duration-300 dark:bg-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">For Tailors</h3>
                </div>
                <p className="text-stone-600 dark:text-stone-400">Grow your business with us</p>
                
                <div>
                  <div className="mb-2 text-4xl font-bold text-stone-900 dark:text-stone-100">15%</div>
                  <p className="text-stone-600 dark:text-stone-400">Commission per completed order</p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Free profile creation",
                    "Unlimited portfolio uploads",
                    "Get matched with clients",
                    "Order management dashboard",
                    "Analytics and insights",
                    "Secure payment processing",
                    "Customer review system",
                    "24/7 support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                      <span className="text-stone-700 dark:text-stone-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Join as Tailor
                  </Button>
                </Link>
              </div>
            </div>

            {/* How Payment Works */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm animate-fade-in-up animation-delay-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">How Payment Works</h2>
                <p className="text-stone-600 dark:text-stone-400">Secure, transparent payment processing</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-stone-900 dark:text-stone-100">1. Client Places Order</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Payment is securely held by Ankara Bubble</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-stone-900 dark:text-stone-100">2. Tailor Completes Work</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Tailor creates and delivers the outfit</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-stone-900 dark:text-stone-100">3. Payment Released</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">85% goes to tailor, 15% platform fee</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
