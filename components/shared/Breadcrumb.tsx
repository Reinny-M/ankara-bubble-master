import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
      <Link href="/" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-orange-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-900 dark:text-stone-100 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
