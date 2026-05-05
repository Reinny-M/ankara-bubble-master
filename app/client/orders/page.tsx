"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { OrdersTableSkeleton } from "@/components/loading/TableSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { Loader2, Search, Filter, Eye, MessageCircle, Star } from "lucide-react"
import { useToast } from "@/components/toast-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'

interface Order {
  id: string
  tailorName: string
  design: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  price: number
  createdAt: string
  estimatedDelivery: string
  description: string
  measurements: {
    height: number
    bust: number
    waist: number
    hips: number
  }
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    tailorName: "Grace Adjei",
    design: "Ankara Evening Gown",
    status: "in_progress",
    price: 45000,
    createdAt: "2024-01-15",
    estimatedDelivery: "2024-02-15",
    description: "Elegant floor-length gown with traditional Ankara print",
    measurements: { height: 165, bust: 90, waist: 75, hips: 95 }
  },
  {
    id: "ORD-002",
    tailorName: "Kwame Asante",
    design: "Ankara Business Suit",
    status: "completed",
    price: 38000,
    createdAt: "2024-01-10",
    estimatedDelivery: "2024-01-25",
    description: "Professional blazer and skirt set",
    measurements: { height: 170, bust: 85, waist: 70, hips: 90 }
  },
  {
    id: "ORD-003",
    tailorName: "Ama Osei",
    design: "Ankara Casual Dress",
    status: "pending",
    price: 22000,
    createdAt: "2024-01-20",
    estimatedDelivery: "2024-02-20",
    description: "Comfortable day dress with modern Ankara print",
    measurements: { height: 160, bust: 88, waist: 72, hips: 92 }
  }
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

function ClientOrdersContent() {
  const { user, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Get user data from Convex with proper error handling
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get user's orders with proper error handling
  const orders = useQuery(api.orders.getOrdersByClient, userData?._id ? { clientId: userData._id } : "skip")
  
  // Mutation for updating order status
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)
  
  // Handle loading states - show loading if Clerk is not loaded or if Convex queries are still loading
  if (!isLoaded) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
            <p className="text-stone-600 dark:text-stone-400">Track and manage your orders</p>
          </div>
          <OrdersTableSkeleton />
        </div>
      </DashboardLayout>
    )
  }
  
  if (!user) {
    return (
      <DashboardLayout role="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Please sign in to continue</h2>
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your orders</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show loading if userData is still loading
  if (userData === undefined) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
            <p className="text-stone-600 dark:text-stone-400">Track and manage your orders</p>
          </div>
          <OrdersTableSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  // If user exists in Clerk but not in Convex, redirect to login
  if (userData === null) {
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

  // Show loading if orders are still loading
  if (orders === undefined) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
            <p className="text-stone-600 dark:text-stone-400">Track and manage your orders</p>
          </div>
          <OrdersTableSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  // Filter orders based on search and status
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = !searchTerm || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoading(true)
    try {
      await updateOrderStatus({
        orderId: orderId as any,
        status: newStatus as any
      })
      toast({
        title: "Order Updated",
        description: `Order ${orderId.slice(-6)} has been ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price)
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
          <p className="text-stone-600 dark:text-stone-400">Track your Ankara fashion orders</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                          </div>
                        </div>
              <div className="sm:w-48">
                <CustomSelect
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  placeholder="Filter by status"
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" }
                  ]}
                  className="sm:w-48"
                />
                    </div>
                  </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-stone-500 dark:text-stone-400">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Design</TableHead>
                      <TableHead>Tailor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                        <TableCell>Design #{order.designId.slice(-6)}</TableCell>
                        <TableCell>Tailor #{order.tailorId.slice(-6)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>KES {order.amount.toLocaleString()}</TableCell>
                        <TableCell>{formatDate(new Date(order.createdAt).toISOString())}</TableCell>
                        <TableCell>
                  <div className="flex gap-2">
                    <CustomModalTrigger
                      onClick={() => {
                        setSelectedOrder(order)
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </CustomModalTrigger>
                    
                    <CustomModal
                      isOpen={selectedOrder?._id === order._id}
                      onClose={() => setSelectedOrder(null)}
                      title={`Order Details - #${order._id.slice(-6)}`}
                      description="View detailed information about this order including measurements, notes, and status updates."
                    >
                                {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                        <h4 className="font-semibold">Design</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">
                                          {selectedOrder.design}
                                        </p>
                            </div>
                            <div>
                                        <h4 className="font-semibold">Tailor</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">
                                          {selectedOrder.tailorName}
                                        </p>
                            </div>
                            <div>
                                        <h4 className="font-semibold">Price</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">
                                          {formatPrice(selectedOrder.price)}
                                        </p>
                            </div>
                            <div>
                                        <h4 className="font-semibold">Status</h4>
                                        <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                                          {selectedOrder.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                            </div>
                          </div>
                                    
                          <div>
                                      <h4 className="font-semibold">Description</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                        {selectedOrder.description}
                            </p>
                          </div>

                          <div>
                                      <h4 className="font-semibold">Measurements</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>Height: {selectedOrder.measurements.height}cm</div>
                                        <div>Bust: {selectedOrder.measurements.bust}cm</div>
                                        <div>Waist: {selectedOrder.measurements.waist}cm</div>
                                        <div>Hips: {selectedOrder.measurements.hips}cm</div>
                          </div>
                        </div>

                                    <div className="grid grid-cols-2 gap-4">
                    <div>
                                        <h4 className="font-semibold">Created</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">
                                          {formatDate(selectedOrder.createdAt)}
                                        </p>
                    </div>
                    <div>
                                        <h4 className="font-semibold">Estimated Delivery</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">
                                          {formatDate(selectedOrder.estimatedDelivery)}
                                        </p>
                    </div>
                  </div>

                                    <div className="flex gap-2 pt-4">
                                      <Button variant="outline" size="sm">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Message Tailor
                                      </Button>
                                      {selectedOrder.status === 'completed' && (
                                        <Button variant="outline" size="sm">
                                          <Star className="h-4 w-4 mr-2" />
                          Leave Review
                        </Button>
                                      )}
                            </div>
                          </div>
                                )}
                    </CustomModal>
                            
                            {order.status === 'pending' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleStatusChange(order._id, 'cancelled')}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                        </div>
            )}
                </CardContent>
              </Card>
      </div>
    </DashboardLayout>
  )
}

export default function ClientOrders() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="client">
        <OrdersTableSkeleton />
      </DashboardLayout>
    )
  }

  return <ClientOrdersContent />
}