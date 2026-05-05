"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CustomSheet, CustomSheetTrigger } from "@/components/ui/custom-sheet"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/shared/Logo"
import { useClerk } from '@clerk/nextjs'
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

// Client-only logout component to avoid SSR issues
function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const { signOut, user } = useClerk()
  const endAllUserSessions = useMutation(api.sessions.endAllUserSessions)
  
  const handleLogout = async () => {
    try {
      // End all active sessions for this user in Convex
      if (user?.id) {
        await endAllUserSessions({ clerkId: user.id })
      }
      
      // Sign out from Clerk (this will trigger session.ended webhook for the current session)
      await signOut({ redirectUrl: '/' })
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect to home page
      window.location.href = '/'
    }
  }
  
  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  )
}
import {
  Menu,
  Home,
  Sparkles,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  Package,
  BarChart3,
  UserCircle,
  Heart,
  TestTube,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "client" | "tailor" | "admin"
}

const clientNavItems: NavItem[] = [
  { label: "Dashboard", href: "/client/dashboard", icon: Home },
  { label: "AI Stylist", href: "/client/ai-stylist", icon: Sparkles },
  { label: "My Recommendations", href: "/client/recommendations", icon: Heart },
  { label: "Browse Tailors", href: "/client/tailors", icon: Users },
  { label: "My Orders", href: "/client/orders", icon: ShoppingBag },
  { label: "Settings", href: "/client/settings", icon: Settings },
]

const tailorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/tailor/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/tailor/orders", icon: Package },
  { label: "Portfolio", href: "/tailor/portfolio", icon: Sparkles },
  { label: "Analytics", href: "/tailor/analytics", icon: BarChart3 },
  { label: "Profile", href: "/tailor/profile", icon: UserCircle },
  { label: "Settings", href: "/tailor/settings", icon: Settings },
]

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Tailors", href: "/admin/tailors", icon: UserCircle },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const navItems = role === "client" ? clientNavItems : role === "tailor" ? tailorNavItems : adminNavItems

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      // If system theme, toggle to opposite of current system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme === "dark" ? "light" : "dark")
    }
  }

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-stone-200 p-6 dark:border-stone-800">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="md" variant="icon" />
          <div>
            <h2 className="font-bold text-stone-900 dark:text-stone-100">Ankara Bubble</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-stone-200 p-4 dark:border-stone-800">
        <button
          onClick={toggleTheme}
          disabled={!mounted}
          className="mb-4 flex w-full items-center justify-between rounded-lg bg-stone-100 p-4 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors disabled:opacity-50"
          aria-label="Toggle theme"
        >
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Theme</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
            <Moon className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </div>
        </button>
        {mounted ? <LogoutButton onLogout={() => {}} /> : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 dark:border-stone-800 dark:bg-stone-900 lg:hidden">
          <CustomSheetTrigger
            onClick={() => {
              setMobileSidebarOpen(true)
            }}
          >
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </CustomSheetTrigger>
          
          <CustomSheet
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            title="Navigation"
            description="Main navigation menu"
          >
            <Sidebar />
          </CustomSheet>
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" variant="full" />
          </Link>
          <div className="w-10" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
