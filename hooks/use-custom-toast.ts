"use client"

import { useState, useCallback } from "react"

export interface CustomToast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
}

let toastCounter = 0

export function useCustomToast() {
  const [toasts, setToasts] = useState<CustomToast[]>([])

  const toast = useCallback((toastData: Omit<CustomToast, 'id'>) => {
    const id = `toast-${++toastCounter}`
    const newToast: CustomToast = {
      id,
      duration: 4000,
      ...toastData
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  }
}
