"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCircle, Package, DollarSign } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from "react"

function AdminDashboardContent() {
  const { user, isLoaded } = useUser()
  
  // Get admin stats
  const userStats = useQuery(api.users.getUserStats, {})
  const orderStats = useQuery(api.orders.getOrderStats, {})
  const recentOrders = useQuery(api.orders.getAllOrders, {})
  
  // Handle loading states
  if (!isLoaded || userStats === undefined || orderStats === undefined || recentOrders === undefined) {
    return (
      <DashboardLayout role="admin">
        <DashboardSkeleton role="admin" />
      </DashboardLayout>
    )
  }
  
  if (!user) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Please sign in to continue</h2>
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view the admin dashboard</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Admin Dashboard</h1>
          <p className="text-stone-600 dark:text-stone-400">Platform overview and management</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {userStats?.clients || 0} clients, {userStats?.tailors || 0} tailors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tailors</CardTitle>
              <UserCircle className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.tailors || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Registered tailors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {orderStats?.completedOrders || 0} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {(orderStats?.totalRevenue || 0).toLocaleString()}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest platform orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400">
                          Design ID: {order.designId.slice(-6)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        KES {order.amount.toLocaleString()}
                      </span>
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
              <CardTitle>System Status</CardTitle>
              <CardDescription>Platform health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Status</span>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Service</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Status</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="admin">
        <DashboardSkeleton role="admin" />
      </DashboardLayout>
    )
  }

  return <AdminDashboardContent />
}