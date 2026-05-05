"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { Search, MessageCircle, Book, HelpCircle, ChevronRight, Home } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function HelpPage() {
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
              <span className="text-orange-600">Help Center</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Help Center
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Find answers to common questions and get support
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-12 animate-fade-in-up animation-delay-400">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <Input 
                  placeholder="Search for help..." 
                  className="h-14 bg-white dark:bg-stone-800 pl-12 text-base dark:text-stone-100 dark:placeholder-stone-400 border-stone-200 dark:border-stone-700" 
                />
              </div>
            </div>

            {/* Help Categories */}
            <div className="mb-12 grid gap-6 md:grid-cols-3 animate-fade-in-up animation-delay-500">
              <div className="group space-y-4 p-6 rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 dark:border-stone-700 dark:hover:border-orange-600 dark:bg-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Getting Started</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Learn the basics of Ankara Bubble</p>
                <div className="flex items-center gap-2 text-xs text-orange-600 font-medium">
                  <ChevronRight className="w-4 h-4" />
                  <span>Learn More</span>
                </div>
              </div>

              <div className="group space-y-4 p-6 rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 dark:border-stone-700 dark:hover:border-orange-600 dark:bg-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">FAQ</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Frequently asked questions</p>
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                  <ChevronRight className="w-4 h-4" />
                  <span>Learn More</span>
                </div>
              </div>

              <div className="group space-y-4 p-6 rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 dark:border-stone-700 dark:hover:border-orange-600 dark:bg-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Contact Support</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Get help from our team</p>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                  <ChevronRight className="w-4 h-4" />
                  <span>Learn More</span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm animate-fade-in-up animation-delay-600">
              <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-stone-100">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-stone-200 dark:border-stone-700">
                  <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                    How do I place an order?
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 dark:text-stone-400">
                    To place an order, browse our tailor directory, select a tailor, and click "Message" to discuss your
                    design requirements. Once you agree on the details, the tailor will create an order for you.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-stone-200 dark:border-stone-700">
                  <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                    How does the AI stylist work?
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 dark:text-stone-400">
                    Our AI stylist analyzes your preferences, body measurements, and style preferences to recommend
                    personalized Ankara designs. Simply fill out the form with your details and get instant recommendations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-stone-200 dark:border-stone-700">
                  <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 dark:text-stone-400">
                    We accept M-Pesa, bank transfers, and major credit/debit cards. All payments are processed securely
                    through our platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-stone-200 dark:border-stone-700">
                  <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                    How long does it take to complete an order?
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 dark:text-stone-400">
                    Order completion time varies by tailor and design complexity. Typically, orders take 1-3 weeks from
                    measurement confirmation to delivery. Your tailor will provide a specific timeline.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border-stone-200 dark:border-stone-700">
                  <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400">
                    Can I cancel or modify my order?
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 dark:text-stone-400">
                    You can cancel or modify your order before the tailor begins production. Once production starts,
                    modifications may incur additional charges. Contact your tailor directly to discuss changes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center animate-fade-in-up animation-delay-700">
              <p className="mb-4 text-stone-600 dark:text-stone-400">Still need help?</p>
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
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
