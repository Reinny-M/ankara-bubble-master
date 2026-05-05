"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CardSkeleton } from "@/components/loading/CardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from '@clerk/nextjs'
import Image from "next/image"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { DesignForm } from "@/components/tailor/DesignForm"
import { useToast } from "@/components/toast-context"

function TailorPortfolioContent() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  
  // Get user data from Convex
  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  
  // Get tailor's designs
  const designs = useQuery(api.designs.getDesignsByTailor, userData?._id ? { tailorId: userData._id } : "skip")
  
  // Mutations
  const deleteDesign = useMutation(api.designs.deleteDesign)
  
  // State for design form
  const [showDesignForm, setShowDesignForm] = useState(false)
  const [editingDesign, setEditingDesign] = useState<any>(null)
  
  const handleDeleteDesign = async (designId: string) => {
    if (!userData?._id) return
    
    try {
      await deleteDesign({
        id: designId as any,
        tailorId: userData._id
      })
      
      toast({
        title: "Design deleted",
        description: "Your design has been removed from your portfolio.",
      })
    } catch (error) {
      console.error('Error deleting design:', error)
      toast({
        title: "Error",
        description: "Failed to delete design. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleEditDesign = (design: any) => {
    setEditingDesign(design)
    setShowDesignForm(true)
  }
  
  const handleAddDesign = () => {
    setEditingDesign(null)
    setShowDesignForm(true)
  }
  
  const handleFormSuccess = () => {
    setShowDesignForm(false)
    setEditingDesign(null)
  }
  
  const handleFormCancel = () => {
    setShowDesignForm(false)
    setEditingDesign(null)
  }
  
  // Handle loading states
  if (!isLoaded || !userData || designs === undefined) {
    return (
      <DashboardLayout role="tailor">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Portfolio</h1>
              <p className="text-stone-600 dark:text-stone-400">Manage your design portfolio</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} titleLines={1} contentLines={2} height="h-64" />
            ))}
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
            <p className="text-stone-600 dark:text-stone-400">You need to be signed in to view your portfolio</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (showDesignForm) {
    return (
      <DashboardLayout role="tailor">
        <DesignForm
          tailorId={userData._id}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          editDesign={editingDesign}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tailor">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Portfolio</h1>
            <p className="text-stone-600 dark:text-stone-400">Showcase your best work</p>
          </div>
          <Button 
            onClick={handleAddDesign}
            className="bg-orange-600 hover:bg-orange-700"
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Design
          </Button>
        </div>

        {designs && designs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((design: any) => (
              <Card key={design._id} className="overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <Image src={design.imageUrl || "/placeholder.svg"} alt={design.title} fill className="object-cover" />
                    </div>
                <CardHeader>
                  <CardTitle className="text-lg">{design.title}</CardTitle>
                  <CardDescription>{design.fabric}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold text-orange-600">KES {design.price.toLocaleString()}</span>
                    <span className="text-sm text-stone-600 dark:text-stone-400">{design.occasion}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditDesign(design)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDeleteDesign(design._id)}
                      title="Delete Design"
                      description={`Are you sure you want to delete "${design.title}"? This action cannot be undone and will also remove the associated image file.`}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-stone-400 dark:text-stone-500 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-600 dark:text-stone-400">No designs yet</h3>
              <p className="text-stone-500 dark:text-stone-500">Start building your portfolio by adding your first design.</p>
            </div>
            <Button onClick={handleAddDesign} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Design
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function TailorPortfolio() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardLayout role="tailor">
        <CardSkeleton />
      </DashboardLayout>
    )
  }

  return <TailorPortfolioContent />
}
