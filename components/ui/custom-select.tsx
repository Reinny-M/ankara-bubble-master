"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
}

export function CustomSelect({
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  className
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === selectedValue)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (option: SelectOption) => {
    setSelectedValue(option.value)
    onValueChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md",
          "bg-white border-gray-300 text-gray-900",
          "dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100",
          "hover:bg-gray-50 dark:hover:bg-stone-700",
          "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        )}
      >
        <span className={selectedOption ? "text-gray-900 dark:text-stone-100" : "text-gray-500 dark:text-stone-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-[99999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-stone-800 dark:border-stone-700">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-stone-700",
                "text-gray-900 dark:text-stone-100",
                "first:rounded-t-md last:rounded-b-md",
                selectedValue === option.value && "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
