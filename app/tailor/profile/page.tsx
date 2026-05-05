"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Award, Save, X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/components/toast-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

function TailorProfileContent() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get tailor analytics for stats
  const analytics = useQuery(api.users.getTailorAnalytics, userData?._id ? { tailorId: userData._id } : "skip")
  
  // Mutation for updating user data
  const updateUserData = useMutation(api.users.updateUser)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    experience: 0,
    specialties: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState("")

  // Update form data when user data loads
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        experience: userData.experience || 0,
        specialties: userData.specialties || []
      })
    } else if (user) {
      // Fallback to Clerk data if Convex data not available
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        location: '',
        bio: '',
        experience: 0,
        specialties: []
      })
    }
  }, [userData, user])

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Update Clerk data
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      // Update Convex data if user exists in database
      if (userData && user) {
        await updateUserData({
          clerkId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          experience: formData.experience,
          specialties: formData.specialties,
        })
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle loading states
  if (!isLoaded || !userData || analytics === undefined) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Profile</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage your public profile</p>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
          </div>
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
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your profile</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tailor">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Profile</h1>
          <p className="text-stone-600 dark:text-stone-400">Manage your public profile</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.avgRating?.toFixed(1) || 0}</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Average Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.completedOrders || 0}</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Completed Orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{userData?.experience || 0} Years</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">{formData.location || "Not specified"}</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Nairobi, Kenya"
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell clients about your experience and specialties..."
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                  onFocus={(e) => e.target.select()}
                  placeholder="5"
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>

              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add specialty..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                  <Button type="button" onClick={addSpecialty} variant="outline">
                    + Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSpecialty(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+254 712 345 678"
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.emailAddresses?.[0]?.emailAddress || ''}
                    disabled
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default function TailorProfile() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        {/* You might want a specific skeleton for profile */}
        <div className="p-8">
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mb-4 animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2 ml-auto" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return <TailorProfileContent />
}
