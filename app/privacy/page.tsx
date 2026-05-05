"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { ChevronRight, Home, Database, Settings, Share2, Shield, UserCheck, Mail } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function PrivacyPage() {
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
              <span className="text-orange-600">Privacy Policy</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Privacy Policy
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400">
                Last updated: January 2025
              </p>
        </div>

            {/* Privacy Sections */}
            <div className="space-y-6 animate-fade-in-up animation-delay-400">
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">1. Information We Collect</h2>
                </div>
            <p className="leading-relaxed text-stone-600 dark:text-stone-400">
              We collect information you provide directly to us, including your name, email address, phone number,
              location, body measurements, and payment information. We also collect information about your use of our
              platform, including orders, messages, and preferences.
            </p>
          </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">2. How We Use Your Information</h2>
                </div>
            <p className="mb-3 leading-relaxed text-stone-600 dark:text-stone-400">
              We use the information we collect to:
            </p>
            <ul className="list-inside list-disc space-y-2 text-stone-600 dark:text-stone-400">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your orders and payments</li>
              <li>Send you updates and promotional materials</li>
              <li>Provide customer support</li>
              <li>Personalize your experience with AI recommendations</li>
            </ul>
          </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">3. Information Sharing</h2>
                </div>
            <p className="leading-relaxed text-stone-600 dark:text-stone-400">
              We share your information with tailors when you place an order, including your measurements and design
              preferences. We do not sell your personal information to third parties. We may share information with
              service providers who help us operate our platform.
            </p>
          </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">4. Data Security</h2>
                </div>
            <p className="leading-relaxed text-stone-600 dark:text-stone-400">
              We implement appropriate security measures to protect your personal information. However, no method of
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">5. Your Rights</h2>
                </div>
            <p className="mb-3 leading-relaxed text-stone-600 dark:text-stone-400">You have the right to:</p>
            <ul className="list-inside list-disc space-y-2 text-stone-600 dark:text-stone-400">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">6. Contact Us</h2>
                </div>
            <p className="leading-relaxed text-stone-600 dark:text-stone-400">
              If you have questions about this Privacy Policy, please contact us at privacy@ankarabubble.com or +254 712
              345 678.
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
