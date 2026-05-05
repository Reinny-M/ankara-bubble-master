"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { Sparkles, ShoppingBag, Heart, TrendingUp } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'
import Image from "next/image"
import Link from "next/link"

function ClientDashboardContent() {
  const { user, isLoaded } = useUser()
  const [selectedDesign, setSelectedDesign] = useState<any>(null)
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get user's orders
  const orders = useQuery(api.orders.getOrdersByClient, userData?._id ? { clientId: userData._id } : "skip")
  
  // Get recommended designs
  const designs = useQuery(api.designs.getDesigns, {})
  
  // Handle loading states
  if (!isLoaded) {
    return (
      <DashboardLayout role="client">
        <DashboardSkeleton role="client" />
      </DashboardLayout>
    )
  }
  
  if (!user) {
    return (
      <DashboardLayout role="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Please sign in to continue</h2>
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your dashboard</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // If user exists in Clerk but not in Convex, redirect to signup or show error
  if (userData === null) {
    fetch("/api/user/sync", { method: "POST" }).then(() => window.location.reload())
    return (
      <DashboardLayout role="client">
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

  // Show loading while data is being fetched
  if (orders === undefined || designs === undefined) {
    return (
      <DashboardLayout role="client">
        <DashboardSkeleton role="client" />
      </DashboardLayout>
    )
  }
  
  // Calculate stats
  const activeOrders = orders?.filter((order: any) => 
    order.status === "pending" || order.status === "accepted" || order.status === "in_progress"
  ).length || 0
  
  const completedOrders = orders?.filter((order: any) => order.status === "completed").length || 0
  const totalSpent = orders?.filter((order: any) => order.status === "completed")
    .reduce((sum: number, order: any) => sum + order.amount, 0) || 0

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Welcome Back, {userData?.name || user?.firstName || "User"}
          </h1>
          <p className="text-stone-600 dark:text-stone-400">Here's what's happening with your fashion journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white dark:bg-stone-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {orders?.filter((order: any) => order.status === "in_progress").length || 0} in production
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-stone-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <Heart className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">All time</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-stone-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</div>
              <p className="text-xs text-stone-600 dark:text-stone-400">Across {completedOrders} orders</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Stylist CTA */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:border-orange-900 dark:from-orange-950/30 dark:to-orange-900/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>AI Fashion Assistant</CardTitle>
                <CardDescription className="text-orange-900/70 dark:text-orange-100/70">
                  Get personalized Ankara design recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/client/ai-stylist">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Start AI Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Recent Orders</h2>
            <Link href="/client/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {orders?.slice(0, 2).map((order: any) => (
              <Card key={order._id} className="bg-white dark:bg-stone-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">Order #{order._id.slice(-6)}</CardTitle>
                      <CardDescription>Design ID: {order.designId.slice(-6)}</CardDescription>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : order.status === "in_progress"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                          : order.status === "accepted"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                      }`}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600 dark:text-stone-400">Amount</span>
                      <span className="font-medium">KES {order.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 dark:text-stone-400">Payment</span>
                      <span className="font-medium capitalize">{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 dark:text-stone-400">Created</span>
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">Delivery</span>
                        <span className="font-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-2 text-center py-8">
                <p className="text-stone-500 dark:text-stone-400">No orders yet</p>
                <Link href="/client/tailors">
                  <Button className="mt-2 bg-orange-600 hover:bg-orange-700">
                    Find a Tailor
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Designs */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Recommended For You</h2>
            <Link href="/explore/designs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {designs?.slice(0, 4).map((design: any) => (
              <Card key={design._id} className="overflow-hidden bg-white dark:bg-stone-900">
                <div className="relative aspect-[3/4]">
                  <Image src={design.image || "/placeholder.svg"} alt={design.title} fill className="object-cover" />
                  <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-orange-600 hover:text-white dark:bg-stone-900/90">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold text-stone-900 dark:text-stone-100">{design.title}</h3>
                  <p className="mb-2 text-xs text-stone-600 dark:text-stone-400">{design.fabric}</p>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                      {design.category}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                      {design.occasion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-600">KES {design.price.toLocaleString()}</span>
                    <CustomModalTrigger
                      onClick={() => {
                        setSelectedDesign(design)
                      }}
                    >
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </CustomModalTrigger>
                    
                    <CustomModal
                      isOpen={selectedDesign?._id === design._id}
                      onClose={() => setSelectedDesign(null)}
                      title={design.title}
                      description={`${design.fabric} • ${design.category}`}
                    >
                        <div className="space-y-4">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                            <Image
                              src={design.image || "/placeholder.svg"}
                              alt={design.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-orange-600">KES {design.price.toLocaleString()}</span>
                              <Button className="bg-orange-600 hover:bg-orange-700">
                                <Heart className="mr-2 h-4 w-4" />
                                Save Design
                              </Button>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                              {design.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                                {design.occasion}
                              </span>
                              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                                {design.bodyType}
                              </span>
                            </div>
                          </div>
                          <Link href="/client/tailors">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">Find a Tailor</Button>
                          </Link>
                        </div>
                    </CustomModal>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-4 text-center py-8">
                <p className="text-stone-500 dark:text-stone-400">No designs available yet</p>
                <Link href="/explore/designs">
                  <Button className="mt-2 bg-orange-600 hover:bg-orange-700">
                    Browse Designs
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ClientDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="client">
        <DashboardSkeleton role="client" />
      </DashboardLayout>
    )
  }

  return <ClientDashboardContent />
}

