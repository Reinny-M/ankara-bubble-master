"use client"

import { createContext, useContext, ReactNode } from "react"
import { useCustomToast, CustomToast } from "@/hooks/use-custom-toast"

interface ToastContextType {
  toast: (toastData: Omit<CustomToast, 'id'>) => string
  dismiss: (toastId: string) => void
  dismissAll: () => void
  toasts: CustomToast[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast, dismiss, dismissAll, toasts } = useCustomToast()

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
