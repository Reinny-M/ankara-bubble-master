"use client"

import { useState, useEffect } from "react"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function CustomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  className
}: CustomSheetProps) {
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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[999998]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999998
        }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full z-[999999] bg-white dark:bg-gray-800 shadow-lg",
          "transform transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full",
          className
        )}
        style={{
          zIndex: 999999,
          width: '400px',
          maxWidth: '90vw'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                )}
              </div>
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
          
          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

interface CustomSheetTriggerProps {
  children: React.ReactNode
  onClick: () => void
}

export function CustomSheetTrigger({ children, onClick }: CustomSheetTriggerProps) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}
