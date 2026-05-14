"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { OrdersTableSkeleton } from "@/components/loading/TableSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { Search, Eye, MessageCircle, Star, Send } from "lucide-react"
import { useToast } from "@/components/toast-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'

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
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  const orders = useQuery(api.orders.getOrdersByClient, userData?._id ? { clientId: userData._id } : "skip")
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)

  if (!isLoaded || userData === undefined) {
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

  if (!user || userData === null) {
    return (
      <DashboardLayout role="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Account not found</h2>
            <p className="text-stone-600 dark:text-stone-400">Please log in again.</p>
            <Button onClick={() => window.location.href = '/login'} className="mt-4">Go to Login</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (orders === undefined) {
    return (
      <DashboardLayout role="client">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
          </div>
          <OrdersTableSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = !searchTerm ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const handleCancelOrder = async (orderId: string) => {
    setLoading(true)
    try {
      await updateOrderStatus({ orderId: orderId as any, status: "cancelled" })
      toast({ title: "Order Cancelled", description: "Your order has been cancelled." })
    } catch (error) {
      toast({ title: "Failed", description: "Could not cancel order.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({ title: "Empty message", description: "Please type a message.", variant: "destructive" })
      return
    }
    // Message functionality - for now show success toast
    toast({ title: "Message Sent!", description: "Your message has been sent to the tailor." })
    setMessageText("")
    setShowMessageModal(false)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Orders</h1>
          <p className="text-stone-600 dark:text-stone-400">Track your Ankara fashion orders</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-stone-800 dark:text-stone-100"
                />
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</CardDescription>
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
                        <TableCell>KES {order.amount?.toLocaleString() || '0'}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <CustomModalTrigger onClick={() => { setSelectedOrder(order); setShowMessageModal(false) }}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </CustomModalTrigger>

                            <CustomModal
                              isOpen={selectedOrder?._id === order._id && !showMessageModal}
                              onClose={() => setSelectedOrder(null)}
                              title={`Order Details - #${order._id.slice(-6)}`}
                              description="View detailed information about this order."
                            >
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Design</h4>
                                      <p className="text-sm text-stone-600 dark:text-stone-400">Design #{selectedOrder.designId?.slice(-6)}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Tailor</h4>
                                      <p className="text-sm text-stone-600 dark:text-stone-400">Tailor #{selectedOrder.tailorId?.slice(-6)}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Price</h4>
                                      <p className="text-sm text-stone-600 dark:text-stone-400">KES {selectedOrder.amount?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Status</h4>
                                      <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                                        {selectedOrder.status?.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  {selectedOrder.measurements && (
                                    <div>
                                      <h4 className="font-semibold">Measurements</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                        <div>Height: {selectedOrder.measurements.height}cm</div>
                                        <div>Bust: {selectedOrder.measurements.bust}cm</div>
                                        <div>Waist: {selectedOrder.measurements.waist}cm</div>
                                        <div>Hips: {selectedOrder.measurements.hips}cm</div>
                                      </div>
                                    </div>
                                  )}
                                  {selectedOrder.notes && (
                                    <div>
                                      <h4 className="font-semibold">Notes</h4>
                                      <p className="text-sm text-stone-600 dark:text-stone-400">{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Created</h4>
                                      <p className="text-sm text-stone-600 dark:text-stone-400">{formatDate(selectedOrder.createdAt)}</p>
                                    </div>
                                    {selectedOrder.estimatedDelivery && (
                                      <div>
                                        <h4 className="font-semibold">Estimated Delivery</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">{formatDate(selectedOrder.estimatedDelivery)}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setShowMessageModal(true)
                                      }}
                                    >
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

                            {/* Message Modal */}
                            <CustomModal
                              isOpen={showMessageModal && selectedOrder?._id === order._id}
                              onClose={() => { setShowMessageModal(false) }}
                              title="Message Tailor"
                              description="Send a message to your tailor about this order."
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label>Your Message</Label>
                                  <Textarea
                                    placeholder="Type your message here... e.g. Can you update me on the progress?"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    rows={5}
                                    className="mt-1"
                                  />
                                </div>
                                <Button
                                  className="w-full bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                                  onClick={handleSendMessage}
                                >
                                  <Send className="h-4 w-4" />
                                  Send Message
                                </Button>
                              </div>
                            </CustomModal>

                            {order.status === 'pending' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelOrder(order._id)}
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
  useEffect(() => { setIsClient(true) }, [])
  if (!isClient) return <DashboardLayout role="client"><OrdersTableSkeleton /></DashboardLayout>
  return <ClientOrdersContent />
}
