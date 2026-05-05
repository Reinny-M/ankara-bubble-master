"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/Footer"
import { Testimonials } from "@/components/shared/Testimonials"
import { Newsletter } from "@/components/shared/Newsletter"
import { Sparkles, Users, TrendingUp, ChevronRight, Award, Shield, Camera, Star, ArrowRight, Check, Zap, Globe, Heart } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { useState, useEffect } from "react"

const stats = [
  { value: "500+", label: "Verified Tailors", icon: Users },
  { value: "10K+", label: "Designs Created", icon: Heart },
  { value: "98%", label: "Success Rate", icon: TrendingUp },
  { value: "4.9★", label: "Average Rating", icon: Star },
]

const features = [
  {
    icon: Camera,
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    title: "AI Photo Measurements",
    description: "Upload a photo and our AI instantly extracts your body measurements with high accuracy. No tape measure needed.",
    badge: "New",
  },
  {
    icon: Sparkles,
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    title: "Smart Style Recommendations",
    description: "Get personalized Ankara design suggestions based on your body type, occasion, and style preferences.",
    badge: "AI Powered",
  },
  {
    icon: Users,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    title: "Verified Expert Tailors",
    description: "Connect with 500+ skilled, background-checked tailors specializing in authentic African fashion.",
    badge: "Trusted",
  },
  {
    icon: Zap,
    color: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    title: "Real-Time Order Tracking",
    description: "Track your order from measurement to delivery with live updates and direct tailor communication.",
    badge: "Live",
  },
  {
    icon: Globe,
    color: "from-cyan-500 to-cyan-600",
    textColor: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    title: "Pan-African Network",
    description: "Access tailors across Kenya, Nigeria, Ghana, and beyond. Authentic African fashion, delivered to you.",
    badge: "Africa-Wide",
  },
  {
    icon: Shield,
    color: "from-rose-500 to-rose-600",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    title: "Secure M-Pesa Payments",
    description: "Pay safely with M-Pesa, cards, or bank transfer. Money held in escrow until you approve the final piece.",
    badge: "Secure",
  },
]

const steps = [
  { number: "01", title: "Upload Your Photo", description: "Take or upload a full-body photo. Our AI extracts your measurements instantly." },
  { number: "02", title: "Get AI Style Picks", description: "Receive personalized Ankara design recommendations tailored to your body and taste." },
  { number: "03", title: "Choose Your Tailor", description: "Browse verified tailors, view portfolios, and connect with your perfect match." },
  { number: "04", title: "Wear Your Dream Outfit", description: "Track your order in real-time and receive your custom Ankara masterpiece." },
]

const pricing = [
  {
    name: "Client",
    price: "Free",
    description: "For fashion enthusiasts",
    features: ["AI body measurements", "Style recommendations", "Browse 500+ tailors", "Order tracking", "M-Pesa payments"],
    cta: "Get Started Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Tailor Pro",
    price: "KES 999",
    period: "/month",
    description: "For professional tailors",
    features: ["Unlimited client listings", "Portfolio showcase", "Order management dashboard", "Payment processing", "Priority support", "Analytics & insights"],
    cta: "Start Earning",
    href: "/signup?role=tailor",
    highlighted: true,
  },
]

export default function LandingPage() {
  const { user, isLoaded } = useUser()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm border-b border-stone-200 dark:border-stone-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" variant="full" />
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="#features" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Pricing</Link>
              <Link href="/explore/designs" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">Explore Designs</Link>
            </nav>
            <div className="flex items-center gap-3">
              {isLoaded && user ? (
                <>
                  <Link href={`/${user.unsafeMetadata?.role || 'client'}/dashboard`}>
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-stone-700 dark:text-stone-300">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-5">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-100/50 to-transparent dark:from-orange-950/20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full px-4 py-2 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered African Fashion Platform
              <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-6 leading-tight">
              Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700"> Ankara Outfit</span>
              <br />Starts With a Photo
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload a photo, let AI extract your measurements, get personalized style recommendations, 
              and connect with Africa's best Ankara tailors — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-orange-200 dark:shadow-orange-900/30 w-full sm:w-auto">
                  <Camera className="w-5 h-5 mr-2" />
                  Try AI Measurements Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/explore/designs">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-stone-300 dark:border-stone-700 w-full sm:w-auto">
                  Browse Designs
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white dark:border-stone-950" />
                  ))}
                </div>
                <span>10,000+ happy clients</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                <span className="ml-1">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-stone-900 dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-stone-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Everything You Need for
              <span className="text-orange-600"> Perfect Ankara Fashion</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              From AI measurements to tailor connections, we've built the most complete African fashion platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className={`group p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${feature.bgColor} ${feature.textColor} border border-current/20`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">{feature.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{feature.description}</p>
                <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${feature.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <ArrowRight className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              From Photo to
              <span className="text-orange-600"> Perfect Outfit</span> in 4 Steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-100 dark:from-orange-800 dark:to-stone-900 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">{step.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8">
                Start Your Fashion Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">Free for clients. Fair for tailors.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-2xl border ${plan.highlighted ? 'border-orange-500 bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-2xl shadow-orange-200 dark:shadow-orange-900/30 scale-105' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'}`}>
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? 'text-orange-100' : 'text-stone-500 dark:text-stone-400'}`}>{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ${plan.highlighted ? 'text-orange-100' : 'text-stone-500'}`}>{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-orange-200' : 'text-orange-600'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-orange-50' : 'text-stone-700 dark:text-stone-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full rounded-full font-semibold ${plan.highlighted ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Loved Across Africa
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Ankara Style?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Join 10,000+ fashion lovers who've discovered their perfect Ankara look with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-8 py-6 text-base font-semibold w-full sm:w-auto">
                <Camera className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/explore/designs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold w-full sm:w-auto">
                Browse Designs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      <Footer />
    </div>
  )
}
