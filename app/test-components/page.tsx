"use client"

// Prevent prerendering since this page uses Convex hooks
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/toast-context"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { CustomSelect } from "@/components/ui/custom-select"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { CustomSheet, CustomSheetTrigger } from "@/components/ui/custom-sheet"
import { Badge } from "@/components/ui/badge"
import { CustomTagInput } from "@/components/ui/custom-tag-input"
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Trash2, 
  Settings, 
  Menu,
  TestTube
} from "lucide-react"

export default function TestComponentsPage() {
  const { toast } = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [customSheetOpen, setCustomSheetOpen] = useState(false)

  const testToast = (variant: "default" | "destructive" | "success" | "warning" | "info") => {
    const messages = {
      default: {
        title: "Default Toast",
        description: "This is a default toast message to test visibility."
      },
      destructive: {
        title: "Error Toast",
        description: "This is an error toast message to test visibility."
      },
      success: {
        title: "Success Toast",
        description: "This is a success toast message to test visibility."
      },
      warning: {
        title: "Warning Toast",
        description: "This is a warning toast message to test visibility."
      },
      info: {
        title: "Info Toast",
        description: "This is an info toast message to test visibility."
      }
    }

    toast({
      ...messages[variant],
      variant
    })
  }

  const testMultipleToasts = () => {
    testToast("success")
    setTimeout(() => testToast("info"), 500)
    setTimeout(() => testToast("warning"), 1000)
    setTimeout(() => testToast("destructive"), 1500)
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Component Test Suite</h1>
          <p className="text-stone-600 dark:text-stone-400">Test all components to ensure they are visible and working properly</p>
          <Badge variant="outline" className="mt-2">
            Z-Index & Visibility Testing
          </Badge>
        </div>

        {/* Toast Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Toast Messages Testing
            </CardTitle>
            <CardDescription>
              Test different toast variants to check visibility and positioning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => testToast("default")}
                variant="outline"
                className="w-full"
              >
                Default Toast
              </Button>
              <Button 
                onClick={() => testToast("success")}
                variant="outline"
                className="w-full text-green-600 hover:text-green-700"
              >
                Success Toast
              </Button>
              <Button 
                onClick={() => testToast("destructive")}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                Error Toast
              </Button>
              <Button 
                onClick={() => testToast("warning")}
                variant="outline"
                className="w-full text-yellow-600 hover:text-yellow-700"
              >
                Warning Toast
              </Button>
              <Button 
                onClick={() => testToast("info")}
                variant="outline"
                className="w-full text-blue-600 hover:text-blue-700"
              >
                Info Toast
              </Button>
              <Button 
                onClick={testMultipleToasts}
                variant="default"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Multiple Toasts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Modal & Dialog Testing
            </CardTitle>
            <CardDescription>
              Test different modal components to check visibility and z-index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AlertDialog Test - Now Custom */}
              <div className="space-y-2">
                <h4 className="font-medium">AlertDialog (Custom Implementation)</h4>
                <CustomModalTrigger
                  onClick={() => {
                    setAlertDialogOpen(true)
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Test AlertDialog
                  </Button>
                </CustomModalTrigger>
                
                <CustomModal
                  isOpen={alertDialogOpen}
                  onClose={() => setAlertDialogOpen(false)}
                  title="Test AlertDialog"
                  description="This is a test AlertDialog to check if it's visible and properly positioned. The modal should appear above all other content."
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This AlertDialog is now using our custom implementation and should work reliably.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          toast({
                            title: "AlertDialog Action",
                            description: "You clicked Continue!",
                            variant: "success"
                          })
                          setAlertDialogOpen(false)
                        }}
                        className="flex-1"
                      >
                        Continue
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setAlertDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CustomModal>
              </div>

              {/* Custom Delete Dialog Test */}
              <div className="space-y-2">
                <h4 className="font-medium">Custom Delete Dialog</h4>
                <DeleteConfirmationDialog
                  onConfirm={() => {
                    toast({
                      title: "Delete Confirmed",
                      description: "The delete action was triggered successfully.",
                      variant: "success"
                    })
                  }}
                  title="Test Delete"
                  description="This is a test delete confirmation dialog."
                  trigger={
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Test Delete Dialog
                    </Button>
                  }
                />
              </div>

                {/* Sheet Test - Now Custom */}
                <div className="space-y-2">
                  <h4 className="font-medium">Sheet (Custom Implementation)</h4>
                  <CustomSheetTrigger
                    onClick={() => {
                      setCustomSheetOpen(true)
                    }}
                  >
                    <Button variant="outline" className="w-full">
                      <Menu className="w-4 h-4 mr-2" />
                      Test Sheet
                    </Button>
                  </CustomSheetTrigger>
                  
                  <CustomSheet
                    isOpen={customSheetOpen}
                    onClose={() => setCustomSheetOpen(false)}
                    title="Test Sheet"
                    description="This is a test sheet component to check visibility and positioning."
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        This sheet is now using our custom implementation and should work reliably.
                      </p>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => {
                            toast({
                              title: "Sheet Action",
                              description: "You clicked the sheet action!",
                              variant: "info"
                            })
                          }}
                          className="w-full"
                        >
                          Sheet Action
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setCustomSheetOpen(false)}
                          className="w-full"
                        >
                          Close Sheet
                        </Button>
                      </div>
                    </div>
                  </CustomSheet>
                </div>

              {/* Dialog Test - Now Custom */}
              <div className="space-y-2">
                <h4 className="font-medium">Dialog (Custom Implementation)</h4>
                <CustomModalTrigger
                  onClick={() => {
                    setDialogOpen(true)
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Test Dialog
                  </Button>
                </CustomModalTrigger>
                
                <CustomModal
                  isOpen={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  title="Test Dialog"
                  description="This is a test dialog component to check visibility and z-index."
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This dialog is now using our custom implementation and should work reliably.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Dialog Action",
                            description: "You clicked the dialog action!",
                            variant: "success"
                          })
                          setDialogOpen(false)
                        }}
                        className="flex-1"
                      >
                        Action
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Close Dialog
                      </Button>
                    </div>
                  </div>
                </CustomModal>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Components Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-purple-600" />
              Custom Components Testing
            </CardTitle>
            <CardDescription>
              Test custom modal and sheet components that should work reliably
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Custom Modal Test */}
              <div className="space-y-2">
                <h4 className="font-medium">Custom Modal</h4>
                <CustomModalTrigger
                  onClick={() => {
                    setCustomModalOpen(true)
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Test Custom Modal
                  </Button>
                </CustomModalTrigger>
                
                <CustomModal
                  isOpen={customModalOpen}
                  onClose={() => setCustomModalOpen(false)}
                  title="Custom Modal Test"
                  description="This is a custom modal component that should be fully visible and functional."
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This modal is built with custom components and should work reliably.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Modal Action",
                            description: "You clicked the action button!",
                            variant: "success"
                          })
                          setCustomModalOpen(false)
                        }}
                        className="flex-1"
                      >
                        Action
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setCustomModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CustomModal>
              </div>

              {/* Custom Sheet Test */}
              <div className="space-y-2">
                <h4 className="font-medium">Custom Sheet</h4>
                <CustomSheetTrigger
                  onClick={() => {
                    setCustomSheetOpen(true)
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <Menu className="w-4 h-4 mr-2" />
                    Test Custom Sheet
                  </Button>
                </CustomSheetTrigger>
                
                <CustomSheet
                  isOpen={customSheetOpen}
                  onClose={() => setCustomSheetOpen(false)}
                  title="Custom Sheet Test"
                  description="This is a custom sheet component that should slide in from the right."
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This sheet is built with custom components and should work reliably.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Sheet Action",
                            description: "You clicked the action button!",
                            variant: "info"
                          })
                        }}
                        className="w-full"
                      >
                        Sheet Action
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setCustomSheetOpen(false)}
                        className="w-full"
                      >
                        Close Sheet
                      </Button>
                    </div>
                  </div>
                </CustomSheet>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Select & Dropdown Testing
            </CardTitle>
            <CardDescription>
              Test select components to check dropdown visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Custom Select</h4>
                <CustomSelect
                  placeholder="Select an option"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                    { value: "option4", label: "Option 4" },
                  ]}
                  onValueChange={(value) => {
                    toast({
                      title: "Option Selected",
                      description: `You selected: ${value}`,
                      variant: "info"
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Select with Many Options</h4>
                <CustomSelect
                  placeholder="Choose a color"
                  options={Array.from({ length: 20 }, (_, i) => ({
                    value: `color-${i}`,
                    label: `Color Option ${i + 1}`
                  }))}
                  onValueChange={(value) => {
                    toast({
                      title: "Color Selected",
                      description: `You selected: ${value}`,
                      variant: "success"
                    })
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Select / Tag Input Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Multi-Select / Tag Input Components
            </CardTitle>
            <CardDescription>
              Test dynamic tag input components with add/remove functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Materials Example */}
            <CustomTagInput
              label="Materials (like DesignForm)"
              placeholder="Add material..."
              value={["Cotton", "Silk", "Linen"]}
              onChange={(materials) => {
                toast({
                  title: "Materials Updated",
                  description: `Materials: ${materials.join(", ")}`,
                  variant: "success"
                })
              }}
            />

            {/* Colors Example */}
            <CustomTagInput
              label="Colors"
              placeholder="Add color..."
              value={["Red", "Blue", "Green"]}
              onChange={(colors) => {
                toast({
                  title: "Colors Updated",
                  description: `Colors: ${colors.join(", ")}`,
                  variant: "success"
                })
              }}
            />

            {/* Sizes Example */}
            <CustomTagInput
              label="Available Sizes"
              placeholder="Add size..."
              value={["S", "M", "L", "XL"]}
              onChange={(sizes) => {
                toast({
                  title: "Sizes Updated",
                  description: `Sizes: ${sizes.join(", ")}`,
                  variant: "success"
                })
              }}
            />

            {/* Tags Example */}
            <CustomTagInput
              label="Tags"
              placeholder="Add tag..."
              value={["Elegant", "Modern", "Traditional"]}
              onChange={(tags) => {
                toast({
                  title: "Tags Updated",
                  description: `Tags: ${tags.join(", ")}`,
                  variant: "success"
                })
              }}
            />
          </CardContent>
        </Card>

        {/* Z-Index Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Z-Index & Layering Test
            </CardTitle>
            <CardDescription>
              Test components with different z-index values to check layering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Click the buttons below to test if components appear in the correct order:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => {
                    toast({
                      title: "High Z-Index Toast",
                      description: "This toast should appear above everything else.",
                      variant: "info"
                    })
                  }}
                  className="w-full"
                >
                  Test High Z-Index
                </Button>
                
                <Button 
                  onClick={() => {
                    testToast("success")
                    setTimeout(() => {
                      toast({
                        title: "Overlay Test",
                        description: "This should test overlay positioning.",
                        variant: "warning"
                      })
                    }, 1000)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Test Overlay Stacking
                </Button>

                <Button 
                  onClick={() => {
                    testToast("destructive")
                    setTimeout(() => testToast("info"), 500)
                    setTimeout(() => testToast("success"), 1000)
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Test Multiple Layers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Testing Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <p><strong>1. Toast Testing:</strong> Click toast buttons and verify they appear in the top-right corner and stay visible for 4 seconds.</p>
              <p><strong>2. Modal Testing:</strong> Click modal buttons and verify dialogs appear centered with proper overlay.</p>
              <p><strong>3. Select Testing:</strong> Click select dropdowns and verify options are visible and clickable.</p>
              <p><strong>4. Z-Index Testing:</strong> Test multiple components simultaneously to check layering order.</p>
              <p><strong>Expected Result:</strong> All components should be fully visible with proper positioning and no elements hidden behind others.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
