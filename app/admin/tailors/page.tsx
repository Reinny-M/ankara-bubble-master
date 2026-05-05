"use client"
export const dynamic = 'force-dynamic'
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Scissors, Search, CheckCircle, XCircle, MapPin, Calendar,
  Star, Package, DollarSign, Phone, Mail, Eye, TrendingUp,
  Award, Clock, ToggleLeft, ToggleRight
} from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/toast-context"

export default function AdminTailors() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'accepting'>('all')
  const [selectedTailor, setSelectedTailor] = useState<any>(null)
  const { toast } = useToast()

  const users = useQuery(api.users.getAllUsers, {})
  const updateUser = useMutation(api.users.updateUser)

  const tailors = users?.filter((u: any) => u.role === 'tailor') || []

  const filtered = tailors.filter((t: any) => {
    const matchesSearch = !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase()) ||
      t.specialties?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter =
      filter === 'all' ||
      (filter === 'verified' && t.isVerified) ||
      (filter === 'unverified' && !t.isVerified) ||
      (filter === 'accepting' && t.acceptingOrders)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: tailors.length,
    verified: tailors.filter((t: any) => t.isVerified).length,
    accepting: tailors.filter((t: any) => t.acceptingOrders).length,
    unverified: tailors.filter((t: any) => !t.isVerified).length,
  }

  const handleVerify = async (tailor: any) => {
    try {
      await updateUser({ clerkId: tailor.clerkId, isVerified: !tailor.isVerified })
      toast({
        title: tailor.isVerified ? "Tailor Unverified" : "Tailor Verified! ✅",
        description: `${tailor.name} has been ${tailor.isVerified ? 'unverified' : 'verified'}.`,
      })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update tailor.", variant: "destructive" })
    }
  }

  const handleToggleAccepting = async (tailor: any) => {
    try {
      await updateUser({ clerkId: tailor.clerkId, acceptingOrders: !tailor.acceptingOrders })
      toast({
        title: tailor.acceptingOrders ? "Orders Paused" : "Now Accepting Orders",
        description: `${tailor.name}'s order status updated.`,
      })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update tailor.", variant: "destructive" })
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
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Tailor Management</h1>
            <p className="text-stone-600 dark:text-stone-400">Verify and manage platform tailors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tailors', value: stats.total, icon: Scissors, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Unverified', value: stats.unverified, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: 'Accepting Orders', value: stats.accepting, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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

        {/* Unverified Alert */}
        {stats.unverified > 0 && (
          <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>{stats.unverified} tailor{stats.unverified > 1 ? 's' : ''}</strong> waiting for verification!
            </p>
            <button onClick={() => setFilter('unverified')} className="ml-auto text-xs font-semibold text-yellow-700 hover:underline">
              Review Now →
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search by name, email, location or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full border-stone-200 dark:border-stone-700"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'verified', 'unverified', 'accepting'] as const).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-orange-100'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tailors Grid */}
        {filtered.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Scissors className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No tailors found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tailor: any) => (
              <Card key={tailor._id} className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${selectedTailor?._id === tailor._id ? 'ring-2 ring-orange-500' : ''}`}>
                <div className={`h-1 ${tailor.isVerified ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'}`} />
                <CardContent className="p-5">
                  {/* Tailor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {(tailor.name || 'T')[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{tailor.name}</h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {tailor.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {tailor.isVerified ? (
                        <Badge className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1">
                          <XCircle className="w-3 h-3" />Pending
                        </Badge>
                      )}
                      {tailor.acceptingOrders ? (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Open</Badge>
                      ) : (
                        <Badge className="bg-stone-100 text-stone-600 text-xs">Closed</Badge>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {tailor.location && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        {tailor.location}
                      </p>
                    )}
                    {tailor.experience && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <Award className="w-3 h-3 text-orange-500" />
                        {tailor.experience} years experience
                      </p>
                    )}
                    {tailor.minOrderAmount && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-orange-500" />
                        Min order: KES {tailor.minOrderAmount.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(tailor.createdAt)}
                    </p>
                  </div>

                  {/* Specialties */}
                  {tailor.specialties && tailor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tailor.specialties.slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                      {tailor.specialties.length > 3 && (
                        <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          +{tailor.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bio Preview */}
                  {tailor.bio && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 italic">
                      "{tailor.bio}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerify(tailor)}
                      className={`flex-1 rounded-full text-xs ${tailor.isVerified ? 'bg-red-100 text-red-700 hover:bg-red-200 border-0' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                      {tailor.isVerified ? (
                        <><XCircle className="w-3 h-3 mr-1" />Unverify</>
                      ) : (
                        <><CheckCircle className="w-3 h-3 mr-1" />Verify</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAccepting(tailor)}
                      className="flex-1 rounded-full text-xs">
                      {tailor.acceptingOrders ? (
                        <><ToggleRight className="w-3 h-3 mr-1 text-blue-600" />Pause</>
                      ) : (
                        <><ToggleLeft className="w-3 h-3 mr-1" />Activate</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTailor(selectedTailor?._id === tailor._id ? null : tailor)}
                      className="rounded-full text-xs text-orange-600 hover:bg-orange-50">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Tailor Detail Panel */}
        {selectedTailor && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-stone-100 dark:border-stone-800">
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="w-4 h-4 text-orange-600" />
                Full Profile — {selectedTailor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Full Name', value: selectedTailor.name || 'Not set' },
                  { label: 'Email', value: selectedTailor.email },
                  { label: 'Phone', value: selectedTailor.phone || 'Not set' },
                  { label: 'Location', value: selectedTailor.location || 'Not set' },
                  { label: 'Experience', value: selectedTailor.experience ? `${selectedTailor.experience} years` : 'Not set' },
                  { label: 'Min Order Amount', value: selectedTailor.minOrderAmount ? `KES ${selectedTailor.minOrderAmount}` : 'Not set' },
                  { label: 'Avg Turnaround', value: selectedTailor.avgTurnaroundDays ? `${selectedTailor.avgTurnaroundDays} days` : 'Not set' },
                  { label: 'M-Pesa Number', value: selectedTailor.mpesaNumber || 'Not set' },
                  { label: 'Verified', value: selectedTailor.isVerified ? '✅ Yes' : '❌ No' },
                  { label: 'Accepting Orders', value: selectedTailor.acceptingOrders ? '✅ Yes' : '❌ No' },
                  { label: 'Joined', value: formatDate(selectedTailor.createdAt) },
                  { label: 'Specialties', value: selectedTailor.specialties?.join(', ') || 'Not set' },
                ].map((item, i) => (
                  <div key={i} className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{item.value}</p>
                  </div>
                ))}
              </div>
              {selectedTailor.bio && (
                <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Bio</p>
                  <p className="text-sm text-stone-700 dark:text-stone-300">{selectedTailor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-stone-400 text-center">
          Showing {filtered.length} of {tailors.length} tailors
        </p>
      </div>
    </DashboardLayout>
  )
}
