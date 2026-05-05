import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CardSkeletonProps {
  titleLines?: number
  contentLines?: number
  height?: string
  className?: string
}

export function CardSkeleton({ 
  titleLines = 1, 
  contentLines = 3, 
  height = "h-32",
  className = ""
}: CardSkeletonProps) {
  return (
    <Card className={`bg-white dark:bg-stone-900 ${className}`}>
      <CardHeader className="space-y-2">
        {/* Title skeleton */}
        <div className="space-y-2">
          {Array.from({ length: titleLines }).map((_, i) => (
            <Skeleton 
              key={i}
              className={`h-4 bg-stone-200 dark:bg-stone-800 ${
                i === titleLines - 1 ? 'w-3/4' : 'w-full'
              }`} 
            />
          ))}
        </div>
        {/* Description skeleton */}
        <Skeleton className="h-3 w-1/2 bg-stone-200 dark:bg-stone-800" />
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Content skeleton */}
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton 
            key={i}
            className={`h-3 bg-stone-200 dark:bg-stone-800 ${
              i === contentLines - 1 ? 'w-2/3' : 'w-full'
            }`} 
          />
        ))}
        {/* Additional content area */}
        <div className={`${height} bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse`} />
      </CardContent>
    </Card>
  )
}

interface StatsCardSkeletonProps {
  className?: string
}

export function StatsCardSkeleton({ className = "" }: StatsCardSkeletonProps) {
  return (
    <Card className={`bg-white dark:bg-stone-900 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24 bg-stone-200 dark:bg-stone-800" />
        <Skeleton className="h-4 w-4 bg-stone-200 dark:bg-stone-800 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 bg-stone-200 dark:bg-stone-800 mb-2" />
        <Skeleton className="h-3 w-32 bg-stone-200 dark:bg-stone-800" />
      </CardContent>
    </Card>
  )
}
