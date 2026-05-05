"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { ChevronRight, Home, FileText, Shield, CreditCard, Users, Copyright, AlertTriangle, Mail } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function TermsPage() {
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
              <span className="text-orange-600">Terms of Service</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Terms of Service
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400">
                Last updated: January 2025
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-6 animate-fade-in-up animation-delay-400">
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">1. Acceptance of Terms</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  By accessing and using Ankara Bubble, you accept and agree to be bound by these Terms of Service. If you
                  do not agree to these terms, please do not use our platform.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">2. User Accounts</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities
                  that occur under your account. You must provide accurate and complete information when creating an
                  account.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">3. Orders and Payments</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  All orders are subject to acceptance by the tailor. Prices are in Kenyan Shillings (KES) and include
                  applicable taxes. Payment must be made in full before production begins. Refunds are subject to our refund
                  policy and tailor agreement.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">4. Tailor Responsibilities</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  Tailors are independent contractors responsible for the quality and timely delivery of their work. Ankara
                  Bubble facilitates connections but is not responsible for the final product quality or delivery timelines.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Copyright className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">5. Intellectual Property</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  All content on Ankara Bubble, including designs, logos, and text, is protected by copyright and trademark
                  laws. You may not use our content without permission.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">6. Limitation of Liability</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  Ankara Bubble is not liable for any indirect, incidental, or consequential damages arising from your use
                  of the platform. Our total liability is limited to the amount you paid for the service.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">7. Contact Information</h2>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  For questions about these Terms of Service, contact us at legal@ankarabubble.com or +254 712 345 678.
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
