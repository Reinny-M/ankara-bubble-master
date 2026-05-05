"use client"

import { useState } from "react"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  onConfirm: () => void
  title?: string
  description?: string
  trigger?: React.ReactNode
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  onConfirm,
  title = "Delete Recommendation",
  description = "Are you sure you want to delete this recommendation? This action cannot be undone.",
  trigger,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <>
      <CustomModalTrigger
        onClick={() => {
          setOpen(true)
        }}
      >
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </CustomModalTrigger>
      
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This action cannot be undone. Please confirm that you want to proceed.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}
