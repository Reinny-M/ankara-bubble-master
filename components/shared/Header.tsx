"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette, Search, Bell, User, Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Ankara Bubble</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/client/dashboard" className="text-stone-400 hover:text-white transition-colors">
              Client Mode
            </Link>
            <Link href="/tailor/dashboard" className="text-stone-400 hover:text-white transition-colors">
              Tailor Mode
            </Link>
            <Link href="/explore/designs" className="text-stone-400 hover:text-white transition-colors">
              Explore
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-800">
            <nav className="flex flex-col gap-3">
              <Link
                href="/client/dashboard"
                className="px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-lg transition-all"
              >
                Client Mode
              </Link>
              <Link
                href="/tailor/dashboard"
                className="px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-lg transition-all"
              >
                Tailor Mode
              </Link>
              <Link
                href="/explore/designs"
                className="px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-lg transition-all"
              >
                Explore
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
