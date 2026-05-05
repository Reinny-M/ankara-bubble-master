"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/shared/Footer"
import { Logo } from "@/components/shared/Logo"
import { Mail, MapPin, Phone, ChevronRight, Home, MessageCircle, Clock } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export default function ContactPage() {
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
              <span className="text-orange-600">Contact</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-12 text-center animate-fade-in-up animation-delay-300">
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                Contact Us
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                We'd love to hear from you. Send us a message!
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 animate-fade-in-up animation-delay-400">
              {/* Contact Form */}
              <div className="space-y-6 lg:col-span-2">
                <form className="space-y-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-8 backdrop-blur-sm">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-stone-900 dark:text-stone-100">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-stone-900 dark:text-stone-100">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-900 dark:text-stone-100">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-stone-900 dark:text-stone-100">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help?" 
                      className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-stone-900 dark:text-stone-100">Message</Label>
                    <Textarea 
                      id="message" 
                      rows={6} 
                      placeholder="Tell us more about your inquiry..." 
                      className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:border-stone-700"
                    />
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 font-semibold text-stone-900 dark:text-stone-100">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Email</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400">hello@ankarabubble.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Phone</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400">+254 700 123 456</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Location</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400">Nairobi, Kenya</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">Business Hours</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-orange-50">Monday - Friday: 9:00 AM - 6:00 PM EAT</p>
                    <p className="text-sm text-orange-50">Saturday: 10:00 AM - 4:00 PM EAT</p>
                    <p className="text-sm text-orange-50">Sunday: Closed</p>
                  </div>
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
