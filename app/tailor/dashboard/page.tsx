"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Package, CheckCircle, Clock, TrendingUp, Star, User } from "lucide-react"

function TailorDashboardContent() {
  const { user } = useUser()
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  const orders = useQuery(api.orders.getOrdersByTailor, userData?._id ? { tailorId: userData._id } : "skip")
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    in_progress: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0
  const inProgressOrders = orders?.filter(o => o.status === "in_progress").length || 0
  const completedOrders = orders?.filter(o => o.status === "completed").length || 0
  const totalRevenue = orders?.filter(o => o.status === "completed").reduce((sum, o) => sum + o.amount, 0) || 0

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId: orderId as any, status: newStatus as any })
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  if (!userData) {
    return (
      <DashboardLayout role="tailor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tailor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Welcome Back, {userData.name || user?.firstName}!
          </h1>
          <p className="text-stone-600 dark:text-stone-400">Here's what's happening with your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending", value: pendingOrders, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "In Progress", value: inProgressOrders, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Completed", value: completedOrders, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                <p className="text-xs text-stone-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-600 to-orange-500 text-white">
          <CardContent className="p-6">
            <p className="text-orange-100 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold mt-1">KES {totalRevenue.toLocaleString()}</p>
            <p className="text-orange-100 text-xs mt-1">From {completedOrders} completed orders</p>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stone-900 dark:text-stone-100">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">No orders yet</p>
                <p className="text-stone-400 text-sm">Orders from clients will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-stone-500">
                        KES {order.amount.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-stone-400 mt-1 max-w-xs truncate">{order.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                        {order.status.replace("_", " ")}
                      </Badge>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                          onClick={() => handleStatusUpdate(order._id, "accepted")}
                        >
                          Accept
                        </Button>
                      )}
                      {order.status === "accepted" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          onClick={() => handleStatusUpdate(order._id, "in_progress")}
                        >
                          Start Work
                        </Button>
                      )}
                      {order.status === "in_progress" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => handleStatusUpdate(order._id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function TailorDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return <TailorDashboardContent />
}
