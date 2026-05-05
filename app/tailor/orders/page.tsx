"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { OrdersTableSkeleton } from "@/components/loading/TableSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Package } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from "react"

function TailorOrdersContent() {
  const { user, isLoaded } = useUser()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get tailor's orders
  const orders = useQuery(api.orders.getOrdersByTailor, userData?._id ? { tailorId: userData._id } : "skip")
  
  // Handle loading states
  if (!isLoaded) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Order Management</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage your customer orders</p>
          </div>
          <OrdersTableSkeleton />
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
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your orders</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // If user exists in Clerk but not in Convex, redirect to login
  if (userData === null) {
    return (
      <DashboardLayout role="tailor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Account not found</h2>
            <p className="text-stone-600 dark:text-stone-400">Your account data could not be found. Please contact support.</p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="mt-4"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show loading if orders are still loading
  if (orders === undefined) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Order Management</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage your customer orders</p>
          </div>
          <OrdersTableSkeleton />
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
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your orders</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  // Calculate order stats
  const pendingOrders = orders?.filter((order: any) => order.status === "pending").length || 0
  const inProgressOrders = orders?.filter((order: any) => order.status === "in_progress").length || 0
  const completedOrders = orders?.filter((order: any) => order.status === "completed").length || 0
  return (
    <DashboardLayout role="tailor">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Orders</h1>
          <p className="text-stone-600 dark:text-stone-400">Manage your customer orders</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-4 rounded-lg border border-stone-200 p-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Order #{order._id.slice(-6)}</h3>
                        <Badge
                          variant={
                            order.status === "completed" ? "default" :
                            order.status === "in_progress" ? "secondary" :
                            order.status === "accepted" ? "outline" : "destructive"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : order.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                : order.status === "accepted"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                          }
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-400">Design ID: {order.designId.slice(-6)}</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        KES {order.amount.toLocaleString()} • Created: {new Date(order.createdAt).toLocaleDateString()}
                        {order.estimatedDelivery && ` • Due: ${new Date(order.estimatedDelivery).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Accept Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">No Orders Yet</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  You haven't received any orders yet. Start by adding designs to your portfolio.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Add Design to Portfolio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function TailorOrders() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        <OrdersTableSkeleton />
      </DashboardLayout>
    )
  }

  return <TailorOrdersContent />
}
