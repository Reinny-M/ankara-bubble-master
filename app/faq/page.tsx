"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { ChevronRight, Home, HelpCircle, CreditCard, Sparkles, Users } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function FAQPage() {
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
              <span className="text-orange-600">FAQ</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Find answers to common questions about Ankara Bubble
              </p>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-8 animate-fade-in-up animation-delay-400">
              {/* General Questions */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">General Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      What is Ankara Bubble?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Ankara Bubble is an AI-powered platform that connects fashion enthusiasts with skilled tailors
                      specializing in African Ankara (wax print) fashion. We help you find the perfect tailor and get
                      personalized design recommendations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      How do I get started?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Simply sign up for an account, complete your profile with measurements, and start browsing our tailor
                      directory or use our AI stylist for personalized recommendations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      Is Ankara Bubble available in my country?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      We currently operate primarily in Kenya, with plans to expand across East Africa. Check our platform
                      for tailors in your area.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Orders & Payments */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Orders & Payments</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-4" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      How do I place an order?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Browse our tailor directory, select a tailor, and click "Message" to discuss your design. Once you
                      agree on details and pricing, the tailor will create an order for you to confirm and pay.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      What payment methods are accepted?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      We accept M-Pesa, bank transfers, and major credit/debit cards. All payments are processed securely
                      through our platform.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      Can I get a refund?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Refunds are available if you cancel before production begins. Once production starts, refunds are
                      subject to the tailor's policy. Contact support for assistance.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* AI Stylist */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">AI Stylist</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-7" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      How does the AI stylist work?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Our AI analyzes your body measurements, style preferences, occasion, and budget to recommend
                      personalized Ankara designs that suit you best. It learns from thousands of successful designs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      Is the AI stylist free?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Yes! The AI stylist is completely free for all registered users. Get unlimited design recommendations
                      at no cost.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* For Tailors */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">For Tailors</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-9" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      How do I join as a tailor?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      Sign up for a tailor account, complete your profile with your experience and specialties, and submit
                      your portfolio for review. Once approved, you'll start receiving client inquiries.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-10" className="border-stone-200 dark:border-stone-700">
                    <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                      What are the fees?
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 dark:text-stone-400">
                      We charge a 15% commission on completed orders. There are no upfront fees or monthly subscriptions.
                      You only pay when you earn.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
