"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  showText?: boolean
}

export function Logo({ 
  className, 
  size = 'md', 
  variant = 'full', 
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  const LogoIcon = () => (
    <div className={cn(
      "relative flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 shadow-lg ring-1 ring-orange-200/50 dark:ring-orange-800/50",
      sizeClasses[size]
    )}>
      {/* Ankara Pattern-inspired Design */}
      <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm" />
      
      {/* Central Pattern - Stylized Ankara Motif */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-0.5">
          {/* Top Left - Traditional Pattern */}
          <div className="h-1.5 w-1.5 rounded-full bg-white/90 shadow-sm" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm" />
          {/* Bottom Right - Mirror Pattern */}
          <div className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/90 shadow-sm" />
        </div>
      </div>
      
      {/* Decorative Ring */}
      <div className="absolute inset-0 rounded-full border border-white/40 shadow-inner" />
    </div>
  )

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={cn(
        "font-bold tracking-tight text-stone-900 dark:text-stone-100 drop-shadow-sm",
        textSizes[size]
      )}>
        Ankara
      </span>
      <span className={cn(
        "font-semibold tracking-wide text-orange-600 dark:text-orange-400 drop-shadow-sm",
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
      )}>
        Bubble
      </span>
    </div>
  )

  if (variant === 'icon') {
    return <LogoIcon />
  }

  if (variant === 'text') {
    return <LogoText />
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  )
}

// Alternative SVG Logo Component for better scalability
export function LogoSVG({ 
  className, 
  size = 'md', 
  variant = 'full',
  showText = true 
}: LogoProps) {
  const sizeValues = {
    sm: { width: 24, height: 24, textSize: 'text-sm' },
    md: { width: 32, height: 32, textSize: 'text-base' },
    lg: { width: 48, height: 48, textSize: 'text-xl' },
    xl: { width: 64, height: 64, textSize: 'text-2xl' }
  }

  const { width, height, textSize } = sizeValues[size]

  const SVGIcon = () => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ankaraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <pattern id="ankaraPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" opacity="0.8" />
          <circle cx="6" cy="6" r="1" fill="white" opacity="0.6" />
          <circle cx="2" cy="6" r="0.5" fill="white" opacity="0.4" />
          <circle cx="6" cy="2" r="0.5" fill="white" opacity="0.4" />
        </pattern>
      </defs>
      
      {/* Background Circle */}
      <circle cx="16" cy="16" r="15" fill="url(#ankaraGradient)" />
      
      {/* Pattern Overlay */}
      <circle cx="16" cy="16" r="12" fill="url(#ankaraPattern)" opacity="0.3" />
      
      {/* Central Design - Stylized Ankara Motif */}
      <g transform="translate(8, 8)">
        {/* Traditional geometric pattern */}
        <rect x="2" y="2" width="4" height="4" fill="white" opacity="0.9" rx="0.5" />
        <rect x="6" y="6" width="4" height="4" fill="white" opacity="0.7" rx="0.5" />
        <rect x="2" y="6" width="2" height="2" fill="white" opacity="0.5" rx="0.25" />
        <rect x="8" y="2" width="2" height="2" fill="white" opacity="0.5" rx="0.25" />
      </g>
      
      {/* Border Ring */}
      <circle cx="16" cy="16" r="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={cn(
        "font-bold tracking-tight text-stone-900 dark:text-stone-100",
        textSize
      )}>
        Ankara
      </span>
      <span className={cn(
        "font-semibold tracking-wide text-orange-600 dark:text-orange-400",
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
      )}>
        Bubble
      </span>
    </div>
  )

  if (variant === 'icon') {
    return <SVGIcon />
  }

  if (variant === 'text') {
    return <LogoText />
  }

  return (
    <div className="flex items-center gap-2">
      <SVGIcon />
      {showText && <LogoText />}
    </div>
  )
}

// Compact Logo for small spaces
export function LogoCompact({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white/90" />
      </div>
      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
        Ankara Bubble
      </span>
    </div>
  )
}

// Favicon-style logo for browser tabs
export function LogoFavicon({ className }: { className?: string }) {
  return (
    <div className={cn("h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center", className)}>
      <div className="grid grid-cols-2 gap-0.5">
        <div className="h-1 w-1 rounded-full bg-white/90" />
        <div className="h-1 w-1 rounded-full bg-white/70" />
        <div className="h-1 w-1 rounded-full bg-white/70" />
        <div className="h-1 w-1 rounded-full bg-white/90" />
      </div>
    </div>
  )
}
