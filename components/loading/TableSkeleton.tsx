import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
  columns?: number
  rows?: number
  className?: string
}

export function TableSkeleton({ 
  columns = 4, 
  rows = 5, 
  className = "" 
}: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20 bg-stone-200 dark:bg-stone-800" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton 
                    className={`h-4 bg-stone-200 dark:bg-stone-800 ${
                      colIndex === 0 ? 'w-32' : 
                      colIndex === columns - 1 ? 'w-16' : 'w-24'
                    }`} 
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface OrdersTableSkeletonProps {
  className?: string
}

export function OrdersTableSkeleton({ className = "" }: OrdersTableSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and filter bar */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 bg-stone-200 dark:bg-stone-800" />
        <Skeleton className="h-10 w-32 bg-stone-200 dark:bg-stone-800" />
        <Skeleton className="h-10 w-24 bg-stone-200 dark:bg-stone-800" />
      </div>
      
      {/* Table */}
      <TableSkeleton columns={6} rows={8} />
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 bg-stone-200 dark:bg-stone-800" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-8 w-8 bg-stone-200 dark:bg-stone-800" />
          <Skeleton className="h-8 w-8 bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  )
}
