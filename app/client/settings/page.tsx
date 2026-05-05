"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { SettingsPageSkeleton } from "@/components/loading/PageSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser, useClerk } from "@clerk/nextjs"
import { useToast } from "@/components/toast-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Save, Trash2, AlertTriangle } from "lucide-react"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"

function ClientSettingsContent() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { toast } = useToast()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Mutation for updating user data
  const updateUserData = useMutation(api.users.updateUser)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  // Update form data when user data loads
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        location: userData.location || ''
      })
    } else if (user) {
      // Fallback to Clerk data if Convex data not available
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        location: ''
      })
    }
  }, [userData, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Update Clerk data
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      // Update Convex data - only update if user exists
      if (user && userData) {
        // User exists in Convex, update them
        await updateUserData({
          clerkId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
        })
      } else if (user && !userData) {
        // User exists in Clerk but not in Convex - this shouldn't happen
        // Redirect them to signup or show error
        toast({
          title: "Account not found",
          description: "Your account data could not be found. Please contact support or sign up again.",
          variant: "destructive",
        })
        return
      }
      
      toast({
        title: "Settings updated",
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      })
      return
    }

    setDeleteLoading(true)
    
    try {
      // Check if user exists in Convex first
      if (!userData) {
        toast({
          title: "Account not found",
          description: "Your account data could not be found. Please contact support.",
          variant: "destructive",
        })
        return
      }

      // Try to delete from Clerk first
      // Clerk requires additional verification for account deletion
      try {
        await user?.delete()
        
        // If Clerk deletion succeeds, the webhook will handle Convex cleanup
        toast({
          title: "Account deleted",
          description: "Your account and all associated data have been permanently deleted.",
        })

        // Sign out and redirect immediately
        await signOut()
        window.location.href = '/'
        
      } catch (clerkError: any) {
        // If Clerk requires additional verification, show a helpful message
        if (clerkError?.message?.includes('additional verification') || 
            clerkError?.errors?.[0]?.message?.includes('additional verification')) {
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your identity before deleting your account. This is required for security.",
            variant: "destructive",
          })
          return
        }
        throw clerkError
      }
      
    } catch (error) {
      console.error('Account deletion error:', error)
      toast({
        title: "Deletion failed",
        description: "Failed to delete your account. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setDeleteConfirmation('')
    }
  }

  // Handle loading states
  if (!isLoaded) {
    return (
      <DashboardLayout role="client">
        <SettingsPageSkeleton />
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout role="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Please sign in to continue</h2>
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your settings</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="client">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
          <p className="text-stone-600 dark:text-stone-400">Manage your account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>
            </div>
            <div>
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
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Nairobi, Kenya"
                className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that will permanently affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">Delete Account</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <CustomModalTrigger
                  onClick={() => {
                    setShowDeleteModal(true)
                  }}
                >
                  <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </CustomModalTrigger>
              </div>
            </div>
          </CardContent>
        </Card>

        <CustomModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeleteConfirmation('')
          }}
          title="Delete Account"
          description="This action cannot be undone. This will permanently delete your account and remove all data from our servers."
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Warning</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 mt-2 list-disc list-inside space-y-1">
                    <li>Your profile and personal information</li>
                    <li>All AI stylist recommendations</li>
                    <li>Order history and preferences</li>
                    <li>All associated data in our database</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="deleteConfirmation" className="text-stone-900 dark:text-stone-100">
                Type <span className="font-mono font-bold">DELETE</span> to confirm:
              </Label>
              <Input
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="mt-2 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </>
                )}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                disabled={deleteLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CustomModal>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default function ClientSettings() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="client">
        <SettingsPageSkeleton />
      </DashboardLayout>
    )
  }

  return <ClientSettingsContent />
}