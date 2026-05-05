"use client"
export const dynamic = 'force-dynamic'
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Search, CheckCircle, Clock, DollarSign, Calendar, XCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const orders = useQuery(api.orders.getAllOrders, {})

  const filtered = orders?.filter((o: any) => {
    const matchesSearch = !search || o._id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o: any) => o.status === 'pending').length || 0,
    inProgress: orders?.filter((o: any) => o.status === 'in_progress').length || 0,
    completed: orders?.filter((o: any) => o.status === 'completed').length || 0,
    cancelled: orders?.filter((o: any) => o.status === 'cancelled').length || 0,
    revenue: orders?.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + o.amount, 0) || 0,
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'in_progress': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'accepted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-stone-100 text-stone-700'
    }
  }

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (!orders) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Order Management</h1>
          <p className="text-stone-600 dark:text-stone-400">Monitor and manage all platform orders</p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-stone-600', bg: 'bg-stone-50 dark:bg-stone-800' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            { label: 'Completed', value: stats.completed, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: 'Revenue', value: `KES ${stats.revenue.toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-stone-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {stats.pending > 0 && (
          <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>{stats.pending} order{stats.pending > 1 ? 's' : ''}</strong> pending tailor response!
            </p>
            <button onClick={() => setStatusFilter('pending')} className="ml-auto text-xs font-semibold text-yellow-700 hover:underline">
              View Pending →
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input placeholder="Search by order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:bg-orange-100'}`}>
                {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: any) => {
              const isExpanded = expandedId === order._id
              return (
                <Card key={order._id} className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className={`h-0.5 ${order.status === 'completed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : order.status === 'in_progress' ? 'bg-orange-500' : order.status === 'accepted' ? 'bg-blue-500' : 'bg-yellow-400'}`} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                          #{order._id.slice(-2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-stone-500">{formatDate(order.createdAt)} · KES {order.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.paymentStatus}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: 'Amount', value: `KES ${order.amount.toLocaleString()}` },
                            { label: 'Payment', value: order.paymentStatus },
                            { label: 'Status', value: order.status.replace('_', ' ') },
                            { label: 'Created', value: formatDate(order.createdAt) },
                            { label: 'Est. Delivery', value: order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Not set' },
                            { label: 'Actual Delivery', value: order.actualDelivery ? formatDate(order.actualDelivery) : 'Not set' },
                            { label: 'Client ID', value: '...' + order.clientId?.slice(-8) },
                            { label: 'Tailor ID', value: '...' + order.tailorId?.slice(-8) },
                          ].map((item, i) => (
                            <div key={i} className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3">
                              <p className="text-xs text-stone-500 mb-1">{item.label}</p>
                              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.value}</p>
                            </div>
                          ))}
                        </div>
                        {order.measurements && (
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Height', value: `${order.measurements.height}cm` },
                              { label: 'Bust', value: `${order.measurements.bust}cm` },
                              { label: 'Waist', value: `${order.measurements.waist}cm` },
                              { label: 'Hips', value: `${order.measurements.hips}cm` },
                            ].map((m, i) => (
                              <div key={i} className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-3 text-center">
                                <p className="text-sm font-bold text-orange-600">{m.value}</p>
                                <p className="text-xs text-stone-500">{m.label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {order.notes && (
                          <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3">
                            <p className="text-xs text-stone-500 mb-1">Notes</p>
                            <p className="text-sm text-stone-700 dark:text-stone-300">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <p className="text-xs text-stone-400 text-center">Showing {filtered.length} of {orders.length} orders</p>
      </div>
    </DashboardLayout>
  )
}
