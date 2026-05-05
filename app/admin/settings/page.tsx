"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SettingsIcon, Globe, Shield, Mail, Save } from "lucide-react"
import { useToast } from "@/components/toast-context"

export default function AdminSettings() {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    platformName: "Ankara Bubble",
    tagline: "Connect with Expert Ankara Fashion Tailors",
    description: "AI-powered platform connecting fashion enthusiasts with skilled Ankara fabric tailors across Kenya.",
    maintenanceMode: false,
    requireEmailVerification: true,
    twoFactorAuth: true,
    sessionTimeout: 60,
    fromEmail: "noreply@ankarabubble.com",
    supportEmail: "support@ankarabubble.com",
    orderNotifications: true,
    commissionRate: 15,
    minOrderAmount: 5000
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // TODO: Implement admin settings save functionality
      // This would typically save to a settings table in Convex
      
      toast({
        title: "Settings updated",
        description: "Platform settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Update failed",
        description: "Failed to update platform settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      platformName: "Ankara Bubble",
      tagline: "Connect with Expert Ankara Fashion Tailors",
      description: "AI-powered platform connecting fashion enthusiasts with skilled Ankara fabric tailors across Kenya.",
      maintenanceMode: false,
      requireEmailVerification: true,
      twoFactorAuth: true,
      sessionTimeout: 60,
      fromEmail: "noreply@ankarabubble.com",
      supportEmail: "support@ankarabubble.com",
      orderNotifications: true,
      commissionRate: 15,
      minOrderAmount: 5000
    })
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    })
  }

  return (
    <DashboardLayout role="admin">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
          <p className="text-stone-600 dark:text-stone-400">Manage platform settings</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>General platform configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input 
                  id="platform-name" 
                  value={formData.platformName}
                  onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input 
                  id="tagline" 
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Maintenance Mode</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Temporarily disable the platform</p>
                </div>
                <Switch 
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => setFormData({...formData, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Platform security configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Require Email Verification</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Users must verify email to access platform
                  </p>
                </div>
                <Switch 
                  checked={formData.requireEmailVerification}
                  onCheckedChange={(checked) => setFormData({...formData, requireEmailVerification: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Two-Factor Authentication</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Enable 2FA for all admin accounts</p>
                </div>
                <Switch 
                  checked={formData.twoFactorAuth}
                  onCheckedChange={(checked) => setFormData({...formData, twoFactorAuth: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  value={formData.sessionTimeout}
                  onChange={(e) => setFormData({...formData, sessionTimeout: parseInt(e.target.value)})}
                  onFocus={(e) => e.target.select()}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Configure email notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input 
                  id="from-email" 
                  type="email" 
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input 
                  id="support-email" 
                  type="email" 
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Order Notifications</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Send email updates for orders</p>
                </div>
                <Switch 
                  checked={formData.orderNotifications}
                  onCheckedChange={(checked) => setFormData({...formData, orderNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <CardTitle>Commission Settings</CardTitle>
                  <CardDescription>Platform commission rates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commission-rate">Platform Commission (%)</Label>
                <Input 
                  id="commission-rate" 
                  type="number" 
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({...formData, commissionRate: parseInt(e.target.value)})}
                  onFocus={(e) => e.target.select()}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
                <p className="text-xs text-stone-600 dark:text-stone-400">Percentage taken from each completed order</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-order">Minimum Order Amount (KES)</Label>
                <Input 
                  id="min-order" 
                  type="number" 
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({...formData, minOrderAmount: parseInt(e.target.value)})}
                  onFocus={(e) => e.target.select()}
                  className="dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={handleReset}>Reset to Defaults</Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
