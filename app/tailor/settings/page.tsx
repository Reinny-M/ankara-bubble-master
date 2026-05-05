"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PasswordInput } from "@/components/ui/password-input"
import { Bell, Lock, CreditCard, Globe, Trash2, AlertTriangle } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/components/toast-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"

function TailorSettingsContent() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Mutation for updating user data
  const updateUserData = useMutation(api.users.updateUser)
  const deleteTailorAccount = useMutation(api.users.deleteTailorAccount)
  
  const [formData, setFormData] = useState({
    acceptingOrders: true,
    minOrderAmount: 10000,
    avgTurnaroundDays: 14,
    mpesaNumber: '',
    bankAccount: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) return ''
    
    let strength = 0
    let feedback = []
    
    if (password.length >= 8) strength++
    else feedback.push('at least 8 characters')
    
    if (/[a-z]/.test(password)) strength++
    else feedback.push('lowercase letters')
    
    if (/[A-Z]/.test(password)) strength++
    else feedback.push('uppercase letters')
    
    if (/[0-9]/.test(password)) strength++
    else feedback.push('numbers')
    
    if (/[^A-Za-z0-9]/.test(password)) strength++
    else feedback.push('special characters')
    
    if (strength < 3) {
      return `Weak - Add ${feedback.slice(0, 2).join(' and ')}`
    } else if (strength < 4) {
      return `Medium - Add ${feedback[0] || 'more complexity'}`
    } else {
      return 'Strong password'
    }
  }

  // Update form data when user data loads
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        acceptingOrders: userData.acceptingOrders ?? true,
        minOrderAmount: userData.minOrderAmount ?? 10000,
        avgTurnaroundDays: userData.avgTurnaroundDays ?? 14,
        mpesaNumber: userData.mpesaNumber || '',
        bankAccount: userData.bankAccount || '',
      }))
    }
  }, [userData])

  const handleBusinessSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (user) {
        await updateUserData({
          clerkId: user.id,
          acceptingOrders: formData.acceptingOrders,
          minOrderAmount: formData.minOrderAmount,
          avgTurnaroundDays: formData.avgTurnaroundDays,
          mpesaNumber: formData.mpesaNumber,
          bankAccount: formData.bankAccount,
        })
        
        toast({
          title: "Settings updated",
          description: "Your business settings have been updated successfully.",
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)
    
    try {
      if (user) {
        await user.updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
        
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        setPasswordStrength('') // Clear password strength indicator
      }
    } catch (error) {
      // Suppress console error for known Clerk password errors
      const errorString = error && typeof error === 'object' ? JSON.stringify(error) : ''
      const errorMsg = error instanceof Error ? error.message : String(error)
      
      // Only log to console if it's not a known password error
      if (!errorString.includes('"code":"form_password_pwned"') && 
          !errorMsg.includes("data breach") &&
          !errorString.includes("data breach")) {
        console.error('Error updating password:', error)
      }
      
      // Handle specific Clerk password errors
      let errorMessage = "Failed to update password. Please try again."
      
      // Check if error is a Clerk error object
      if (error && typeof error === 'object') {
        // Check for Clerk's specific error codes and messages
        if (errorString.includes('"code":"form_password_pwned"') || 
            errorMsg.includes("data breach") || 
            errorString.includes("data breach") ||
            errorMsg.includes("Password has been found in an online data breach")) {
          errorMessage = "This password has been found in an online data breach. Please choose a stronger, unique password for your security."
        } else if (errorString.includes('"code":"form_password_incorrect"') || 
                   errorMsg.includes("current password") || 
                   errorString.includes("current password")) {
          errorMessage = "Current password is incorrect. Please check and try again."
        } else if (errorString.includes('"code":"form_password_too_short"') || 
                   errorMsg.includes("too short") || 
                   errorString.includes("too short")) {
          errorMessage = "Password is too short. Please choose a password with at least 8 characters."
        } else if (errorString.includes('"code":"form_password_too_weak"') || 
                   errorMsg.includes("too weak") || 
                   errorString.includes("too weak")) {
          errorMessage = "Password is too weak. Please choose a stronger password with a mix of letters, numbers, and symbols."
        }
      }
      
      toast({
        title: "Password update failed",
        description: errorMessage,
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
          description: "Your tailor account and all associated data have been permanently deleted.",
        })
        
        // Redirect to home page
        window.location.href = '/'
      } catch (clerkError) {
        console.error('Clerk deletion failed:', clerkError)
        
        // If Clerk deletion fails, try manual cleanup
        const result = await deleteTailorAccount({ userId: userData._id })
        
        toast({
          title: "Account deleted",
          description: `Your tailor account has been deleted. Removed ${result.deletedDesigns} designs, ${result.deletedOrders} orders, and all associated data.`,
        })
        
        // Redirect to home page
        window.location.href = '/'
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
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage your account preferences</p>
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
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your settings</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tailor">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
          <p className="text-stone-600 dark:text-stone-400">Manage your account preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Marketing Emails</CardTitle>
                  <CardDescription>Receive tips and platform updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Marketing Emails</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Receive tips, platform updates, and promotional content to help grow your tailoring business</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    Use a strong, unique password that hasn't been used elsewhere
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                  <PasswordInput 
                    id="current-password" 
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                    placeholder="Enter your current password"
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                  <PasswordInput 
                    id="new-password" 
                    value={formData.newPassword}
                    onChange={(e) => {
                      const newPassword = e.target.value
                      setFormData({...formData, newPassword})
                      setPasswordStrength(checkPasswordStrength(newPassword))
                    }}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                    placeholder="Enter your new password"
                  />
                  {passwordStrength && (
                    <p className={`text-xs ${
                      passwordStrength.includes('Weak') ? 'text-red-600 dark:text-red-400' :
                      passwordStrength.includes('Medium') ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <PasswordInput 
                    id="confirm-password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                    placeholder="Confirm your new password"
                  />
              </div>
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Manage how you receive payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSettingsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpesa">M-Pesa Number</Label>
                  <Input 
                    id="mpesa" 
                    type="tel" 
                    value={formData.mpesaNumber}
                    onChange={(e) => setFormData({...formData, mpesaNumber: e.target.value})}
                    placeholder="+254 712 345 678" 
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                  />
                  <p className="text-xs text-stone-600 dark:text-stone-400">Your M-Pesa mobile money number where you'll receive payments from customers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Account</Label>
                  <Input 
                    id="bank" 
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                    placeholder="Account number" 
                    className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                  />
                  <p className="text-xs text-stone-600 dark:text-stone-400">Your bank account number for receiving payments (optional)</p>
              </div>
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? 'Saving...' : 'Save Payment Info'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>Set your availability for new orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSettingsSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Accepting New Orders</p>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Turn off to stop receiving new orders when you're too busy or on a break</p>
                </div>
                  <Switch 
                    checked={formData.acceptingOrders}
                    onCheckedChange={(checked) => setFormData({...formData, acceptingOrders: checked})}
                  />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min-price">Minimum Order (KES)</Label>
                    <Input 
                      id="min-price" 
                      type="number" 
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                      onFocus={(e) => e.target.select()}
                      className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                    />
                    <p className="text-xs text-stone-600 dark:text-stone-400">Minimum amount you'll accept for new orders</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turnaround">Avg. Turnaround (days)</Label>
                    <Input 
                      id="turnaround" 
                      type="number" 
                      value={formData.avgTurnaroundDays}
                      onChange={(e) => setFormData({...formData, avgTurnaroundDays: Number(e.target.value)})}
                      onFocus={(e) => e.target.select()}
                      className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                    />
                    <p className="text-xs text-stone-600 dark:text-stone-400">Average days it takes you to complete an order</p>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? 'Saving...' : 'Save Business Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>Permanently delete your tailor account and all associated data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">Delete Account</h4>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                    Permanently delete your tailor account and all associated data. This action cannot be undone.
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
        </div>
      </div>

      <CustomModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteConfirmation('')
        }}
        title="Delete Tailor Account"
        description="This action cannot be undone. This will permanently delete your tailor account and remove all data from our servers."
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
                  <li>Your tailor profile and personal information</li>
                  <li>All your designs and design images</li>
                  <li>All orders from customers</li>
                  <li>All customer reviews and ratings</li>
                  <li>All AI recommendations and preferences</li>
                  <li>All associated data in our database</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Type <span className="font-mono font-bold">DELETE</span> to confirm:
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
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
    </DashboardLayout>
  )
}

export default function TailorSettings() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
            <p className="text-stone-600 dark:text-stone-400">Manage your account preferences</p>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return <TailorSettingsContent />
}
