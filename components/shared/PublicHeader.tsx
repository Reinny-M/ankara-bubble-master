import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"

export function PublicHeader() {
  return (
    <header className="border-b border-stone-200/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="font-mono text-lg font-bold uppercase tracking-tight text-stone-900">Ankara Bubble</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/how-it-works" className="text-stone-600 transition-colors hover:text-stone-900">
              How It Works
            </Link>
            <Link href="/pricing" className="text-stone-600 transition-colors hover:text-stone-900">
              Pricing
            </Link>
            <Link href="/explore/designs" className="font-semibold text-orange-600">
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>
    </header>
  )
}
