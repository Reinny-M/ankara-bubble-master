"use client"

import { CustomToaster } from "@/components/ui/custom-toast"
import { useToast } from "@/components/toast-context"

export function CustomToastProvider() {
  const { toasts, dismiss } = useToast()

  return (
    <CustomToaster 
      toasts={toasts} 
      onClose={dismiss} 
    />
  )
}
