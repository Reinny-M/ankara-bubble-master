"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users, Search, Filter, MoreVertical, CheckCircle, XCircle,
  Mail, Phone, MapPin, Calendar, Shield, Scissors, User,
  Trash2, Eye, TrendingUp, ArrowUpDown
} from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/toast-context"
import { useEffect as useEffect2, useState as useState2 } from "react"

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'tailor' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const users = useQuery(api.users.getAllUsers, {})
  const updateUser = useMutation(api.users.updateUser)

  const filtered = users?.filter((u: any) => {
    const matchesSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  }) || []

  const stats = {
    total: users?.length || 0,
    clients: users?.filter((u: any) => u.role === 'client').length || 0,
    tailors: users?.filter((u: any) => u.role === 'tailor').length || 0,
    verified: users?.filter((u: any) => u.isVerified).length || 0,
  }

  const handleVerify = async (user: any) => {
    try {
      await updateUser({ clerkId: user.clerkId, isVerified: !user.isVerified })
      toast({
        title: user.isVerified ? "User Unverified" : "User Verified!",
        description: `${user.name} has been ${user.isVerified ? 'unverified' : 'verified'}.`,
      })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" })
    }
  }

  const getRoleConfig = (role: string) => {
    switch(role) {
      case 'tailor': return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Scissors }
      case 'admin': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: Shield }
      default: return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: User }
    }
  }

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  if (!users) {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">User Management</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage and monitor all platform users</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Clients', value: stats.clients, icon: User, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Tailors', value: stats.tailors, icon: Scissors, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search by name, email or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full border-stone-200 dark:border-stone-700"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'client', 'tailor', 'admin'] as const).map(role => (
              <button key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${roleFilter === role ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-orange-100'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Role</th>
                  <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden md:table-cell">Location</th>
                  <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                  <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="text-right p-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-stone-500">
                      <Users className="w-10 h-10 mx-auto mb-3 text-stone-300" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user: any) => {
                    const roleConfig = getRoleConfig(user.role)
                    const RoleIcon = roleConfig.icon
                    return (
                      <tr key={user._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {(user.name || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{user.name || 'No Name'}</p>
                              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-xs text-stone-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`text-xs ${roleConfig.color} flex items-center gap-1 w-fit`}>
                            <RoleIcon className="w-3 h-3" />
                            {user.role}
                          </Badge>
                          {user.role === 'tailor' && user.specialties && (
                            <p className="text-xs text-stone-400 mt-1">{user.specialties.slice(0,2).join(', ')}</p>
                          )}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {user.location ? (
                            <p className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {user.location}
                            </p>
                          ) : (
                            <span className="text-xs text-stone-400">Not set</span>
                          )}
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <p className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(user.createdAt)}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {user.isVerified ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVerify(user)}
                              className={`text-xs rounded-full ${user.isVerified ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                              {user.isVerified ? 'Unverify' : 'Verify'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
                              className="text-orange-600 hover:bg-orange-50 rounded-full text-xs">
                              {selectedUser?._id === user._id ? 'Hide' : 'Details'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* User Details Panel */}
          {selectedUser && (
            <div className="border-t border-stone-200 dark:border-stone-700 p-6 bg-stone-50 dark:bg-stone-800/50">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600" />
                User Details — {selectedUser.name}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Full Name', value: selectedUser.name || 'Not set' },
                  { label: 'Email', value: selectedUser.email },
                  { label: 'Phone', value: selectedUser.phone || 'Not set' },
                  { label: 'Location', value: selectedUser.location || 'Not set' },
                  { label: 'Role', value: selectedUser.role },
                  { label: 'Verified', value: selectedUser.isVerified ? 'Yes' : 'No' },
                  { label: 'Joined', value: formatDate(selectedUser.createdAt) },
                  { label: 'Clerk ID', value: selectedUser.clerkId?.slice(0, 20) + '...' },
                  ...(selectedUser.role === 'tailor' ? [
                    { label: 'Experience', value: selectedUser.experience ? `${selectedUser.experience} years` : 'Not set' },
                    { label: 'Accepting Orders', value: selectedUser.acceptingOrders ? 'Yes' : 'No' },
                    { label: 'Min Order', value: selectedUser.minOrderAmount ? `KES ${selectedUser.minOrderAmount}` : 'Not set' },
                    { label: 'Specialties', value: selectedUser.specialties?.join(', ') || 'Not set' },
                  ] : []),
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-stone-800 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <p className="text-xs text-stone-400 text-center">
          Showing {filtered.length} of {users.length} users
        </p>
      </div>
    </DashboardLayout>
  )
}
