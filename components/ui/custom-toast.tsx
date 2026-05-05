"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  onClose: (id: string) => void
}

const TOAST_DURATION = 4000

export function CustomToast({
  id,
  title,
  description,
  variant = "default",
  duration = TOAST_DURATION,
  onClose
}: CustomToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Show toast with slight delay for smooth animation
    const showTimer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-hide toast
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onClose(id), 300) // Wait for animation to complete
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(id), 300)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
      default:
        return "bg-white border-stone-200 text-stone-900 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100"
    }
  }

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-stone-600 dark:text-stone-400" />
    }
  }

  return (
    <div
      className={cn(
        "custom-toast custom-toast-container",
        "fixed top-4 right-4 max-w-sm w-full",
        "transform transition-all duration-300 ease-in-out",
        isVisible && !isLeaving 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95",
        "pointer-events-auto"
      )}
      style={{
        zIndex: 999999,
        position: 'fixed',
        top: '16px',
        right: '16px',
        maxWidth: '400px',
        width: 'auto',
        minWidth: '300px'
      }}
    >
      <div
        className={cn(
          "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg",
          getVariantStyles()
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90 mt-1">
                {description}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface CustomToasterProps {
  toasts: Array<{
    id: string
    title?: string
    description?: string
    variant?: "default" | "destructive" | "success" | "warning" | "info"
    duration?: number
  }>
  onClose: (id: string) => void
}

export function CustomToaster({ toasts, onClose }: CustomToasterProps) {
  return (
    <div 
      className="fixed top-4 right-4 z-[999999] space-y-2 pointer-events-none"
      style={{
        maxWidth: '400px',
        width: 'auto',
        minWidth: '300px'
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 999999 - index
          }}
        >
          <CustomToast
            {...toast}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  )
}
