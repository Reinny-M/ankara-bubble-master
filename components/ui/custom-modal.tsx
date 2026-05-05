"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className
}: CustomModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4",
          "transform transition-all duration-300 ease-in-out",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className
        )}
        style={{
          zIndex: 999999,
          position: 'relative',
          minHeight: '200px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </div>
  )
}

interface CustomModalTriggerProps {
  children: React.ReactNode
  onClick: () => void
}

export function CustomModalTrigger({ children, onClick }: CustomModalTriggerProps) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}
