"use client"

export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp, DollarSign, Users, Package, CheckCircle,
  Star, Scissors, BarChart3, PieChart, Activity, ArrowUp, ArrowDown
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function AdminAnalytics() {
  const users = useQuery(api.users.getAllUsers, {})
  const orders = useQuery(api.orders.getAllOrders, {})
  const userStats = useQuery(api.users.getUserStats, {})
  const orderStats = useQuery(api.orders.getOrderStats, {})

  if (!users || !orders || !userStats || !orderStats) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const totalRevenue = orderStats.totalRevenue || 0
  const completedOrders = orderStats.completedOrders || 0
  const totalOrders = orderStats.totalOrders || 0
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
  const avgOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0

  const tailors = users.filter((u: any) => u.role === 'tailor')
  const clients = users.filter((u: any) => u.role === 'client')
  const verifiedTailors = tailors.filter((t: any) => t.isVerified).length
  const acceptingTailors = tailors.filter((t: any) => t.acceptingOrders).length

  const ordersByStatus = [
    { label: 'Pending', value: orders.filter((o: any) => o.status === 'pending').length, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { label: 'Accepted', value: orders.filter((o: any) => o.status === 'accepted').length, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: 'In Progress', value: orders.filter((o: any) => o.status === 'in_progress').length, color: 'bg-orange-500', textColor: 'text-orange-700' },
    { label: 'Completed', value: orders.filter((o: any) => o.status === 'completed').length, color: 'bg-green-500', textColor: 'text-green-700' },
    { label: 'Cancelled', value: orders.filter((o: any) => o.status === 'cancelled').length, color: 'bg-red-500', textColor: 'text-red-700' },
  ]

  const paymentStats = [
    { label: 'Paid', value: orders.filter((o: any) => o.paymentStatus === 'paid').length, color: 'bg-green-100 text-green-700' },
    { label: 'Pending', value: orders.filter((o: any) => o.paymentStatus === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Refunded', value: orders.filter((o: any) => o.paymentStatus === 'refunded').length, color: 'bg-red-100 text-red-700' },
  ]

  const recentOrders = [...orders].sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 5)

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Analytics</h1>
          <p className="text-stone-600 dark:text-stone-400">Platform performance insights and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trend: '+24%', up: true },
            { label: 'Total Orders', value: totalOrders, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', trend: '+18%', up: true },
            { label: 'Total Users', value: userStats.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+12%', up: true },
            { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+5%', up: true },
          ].map((metric, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 ${metric.bg} rounded-xl flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${metric.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {metric.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {metric.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{metric.value}</p>
                <p className="text-xs text-stone-500 mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Avg Order Value', value: `KES ${avgOrderValue.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-600' },
            { label: 'Verified Tailors', value: `${verifiedTailors}/${tailors.length}`, icon: Scissors, color: 'text-purple-600' },
            { label: 'Active Tailors', value: acceptingTailors, icon: Activity, color: 'text-green-600' },
            { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600' },
          ].map((metric, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <div>
                  <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{metric.value}</p>
                  <p className="text-xs text-stone-500">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="w-4 h-4 text-orange-600" />
                Orders by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ordersByStatus.map((item, i) => {
                const pct = totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-stone-700 dark:text-stone-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.value}</span>
                        <span className="text-xs text-stone-500">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Payment Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4 text-orange-600" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {paymentStats.map((item, i) => (
                  <div key={i} className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                    <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{item.value}</p>
                    <Badge className={`text-xs mt-1 ${item.color}`}>{item.label}</Badge>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Total Collected</span>
                  <span className="font-bold text-green-600">KES {totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Pending Collection</span>
                  <span className="font-bold text-yellow-600">
                    KES {orders.filter((o: any) => o.paymentStatus === 'pending').reduce((sum: number, o: any) => sum + o.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Refunded</span>
                  <span className="font-bold text-red-600">
                    KES {orders.filter((o: any) => o.paymentStatus === 'refunded').reduce((sum: number, o: any) => sum + o.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-orange-600" />
                User Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Total Clients', value: clients.length, pct: userStats.totalUsers > 0 ? Math.round((clients.length / userStats.totalUsers) * 100) : 0, color: 'bg-blue-500' },
                { label: 'Total Tailors', value: tailors.length, pct: userStats.totalUsers > 0 ? Math.round((tailors.length / userStats.totalUsers) * 100) : 0, color: 'bg-purple-500' },
                { label: 'Verified Tailors', value: verifiedTailors, pct: tailors.length > 0 ? Math.round((verifiedTailors / tailors.length) * 100) : 0, color: 'bg-green-500' },
                { label: 'Accepting Orders', value: acceptingTailors, pct: tailors.length > 0 ? Math.round((acceptingTailors / tailors.length) * 100) : 0, color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-stone-700 dark:text-stone-300">{item.label}</span>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.value} <span className="text-stone-400 font-normal">({item.pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-orange-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-stone-500 text-sm text-center py-4">No recent orders</p>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">KES {order.amount.toLocaleString()}</p>
                      <Badge className={`text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-stone-900 to-stone-800 text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Platform Health Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Order Success Rate', value: `${completionRate}%`, good: completionRate >= 70 },
                { label: 'Tailor Verification', value: `${tailors.length > 0 ? Math.round((verifiedTailors / tailors.length) * 100) : 0}%`, good: verifiedTailors / (tailors.length || 1) >= 0.5 },
                { label: 'Platform Activity', value: totalOrders > 0 ? 'Active' : 'Low', good: totalOrders > 0 },
                { label: 'Revenue Status', value: totalRevenue > 0 ? 'Growing' : 'Starting', good: totalRevenue > 0 },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                  <p className={`text-xl font-bold ${item.good ? 'text-green-400' : 'text-yellow-400'}`}>{item.value}</p>
                  <p className="text-xs text-stone-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
