import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "./CardSkeleton"

interface PageSkeletonProps {
  showHeader?: boolean
  showBreadcrumbs?: boolean
  contentSections?: number
  className?: string
}

export function PageSkeleton({ 
  showHeader = true,
  showBreadcrumbs = true,
  contentSections = 3,
  className = ""
}: PageSkeletonProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-4 w-4 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-4 w-24 bg-stone-200 dark:bg-stone-800" />
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 bg-stone-200 dark:bg-stone-800 mx-auto" />
          <Skeleton className="h-6 w-128 bg-stone-200 dark:bg-stone-800 mx-auto" />
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        {Array.from({ length: contentSections }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-48 bg-stone-200 dark:bg-stone-800" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <CardSkeleton 
                  key={j} 
                  titleLines={1} 
                  contentLines={2} 
                  height="h-32"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SettingsPageSkeletonProps {
  className?: string
}

export function SettingsPageSkeleton({ className = "" }: SettingsPageSkeletonProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 bg-stone-200 dark:bg-stone-800 mb-2" />
        <Skeleton className="h-4 w-96 bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-stone-200 dark:bg-stone-800" />
            <Skeleton className="h-10 w-full bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-stone-200 dark:bg-stone-800" />
            <Skeleton className="h-10 w-full bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-10 w-full bg-stone-200 dark:bg-stone-800" />
        </div>
        <Skeleton className="h-10 w-24 bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800" />
        <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg space-y-4">
          <Skeleton className="h-4 w-48 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-10 w-32 bg-red-200 dark:bg-red-800" />
        </div>
      </div>
    </div>
  )
}
