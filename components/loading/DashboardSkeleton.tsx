import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton, StatsCardSkeleton } from "./CardSkeleton"
import { TableSkeleton } from "./TableSkeleton"

interface DashboardSkeletonProps {
  role: "client" | "tailor" | "admin"
  className?: string
}

export function DashboardSkeleton({ role, className = "" }: DashboardSkeletonProps) {
  const renderStatsCards = () => {
    const cardCount = role === "admin" ? 4 : 3
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const renderContentArea = () => {
    switch (role) {
      case "client":
        return (
          <div className="space-y-8">
            {/* Recent Orders */}
            <div>
              <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} titleLines={1} contentLines={2} height="h-24" />
                ))}
              </div>
            </div>
            
            {/* Recommended Designs */}
            <div>
              <Skeleton className="h-6 w-40 bg-stone-200 dark:bg-stone-800 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} titleLines={1} contentLines={1} height="h-48" />
                ))}
              </div>
            </div>
          </div>
        )
      
      case "tailor":
        return (
          <div className="space-y-8">
            {/* Recent Orders */}
            <div>
              <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800 mb-4" />
              <TableSkeleton columns={5} rows={4} />
            </div>
            
            {/* Quick Actions */}
            <div>
              <Skeleton className="h-6 w-28 bg-stone-200 dark:bg-stone-800 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} titleLines={1} contentLines={2} height="h-20" />
                ))}
              </div>
            </div>
          </div>
        )
      
      case "admin":
        return (
          <div className="space-y-8">
            {/* Recent Orders */}
            <div>
              <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800 mb-4" />
              <TableSkeleton columns={6} rows={5} />
            </div>
            
            {/* System Status */}
            <div>
              <Skeleton className="h-6 w-28 bg-stone-200 dark:bg-stone-800 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} titleLines={1} contentLines={2} height="h-20" />
                ))}
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 bg-stone-200 dark:bg-stone-800 mb-2" />
        <Skeleton className="h-4 w-96 bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Content Area */}
      {renderContentArea()}
    </div>
  )
}
