"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Star, Users } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from "react"

function TailorAnalyticsContent() {
  const { user, isLoaded } = useUser()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get tailor analytics
  const analytics = useQuery(api.users.getTailorAnalytics, userData?._id ? { tailorId: userData._id } : "skip")
  
  // Handle loading states
  if (!isLoaded || !userData || analytics === undefined) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Analytics</h1>
            <p className="text-stone-600 dark:text-stone-400">Track your business performance</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  if (!user) {
    return (
      <DashboardLayout role="tailor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Please sign in to continue</h2>
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your analytics</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tailor">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Analytics</h1>
          <p className="text-stone-600 dark:text-stone-400">Track your business performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {analytics?.totalRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {analytics?.avgOrderValue?.toLocaleString() || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Per completed order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Star className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.avgRating?.toFixed(1) || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">From {analytics?.totalReviews || 0} reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
              <Users className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.repeatCustomerRate?.toFixed(0) || 0}%</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Customer retention rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-stone-600 dark:text-stone-400">
              Chart visualization coming soon
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Designs</CardTitle>
              <CardDescription>Most ordered designs this month</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.popularDesigns && analytics.popularDesigns.length > 0 ? (
                <div className="space-y-3">
                  {analytics.popularDesigns.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-stone-900 dark:text-stone-100">{item.design.title}</span>
                      <span className="text-sm font-medium text-orange-600">{item.orderCount} orders</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-stone-500 dark:text-stone-400">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
              <CardDescription>Recent reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.recentReviews && analytics.recentReviews.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentReviews.map((review: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-900 dark:text-stone-100">Customer {i + 1}</span>
                        <div className="flex text-orange-600">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star 
                              key={starIdx} 
                              className={cn(
                                "h-3 w-3",
                                starIdx < review.rating ? "fill-current" : "text-stone-300 dark:text-stone-700"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{review.comment || "No comment"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-stone-500 dark:text-stone-400">No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function TailorAnalytics() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Analytics</h1>
            <p className="text-stone-600 dark:text-stone-400">Track your business performance</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return <TailorAnalyticsContent />
}
