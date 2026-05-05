"use client"

import { Loader2, CheckCircle, Mail, Shield } from "lucide-react"

interface AuthLoadingProps {
  message: string
  subMessage?: string
  showProgress?: boolean
  progress?: number
}

export function AuthLoading({ message, subMessage, showProgress = false, progress = 0 }: AuthLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="h-6 w-6 text-orange-600" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {message}
        </h3>
        {subMessage && (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {subMessage}
          </p>
        )}
      </div>

      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="bg-stone-200 dark:bg-stone-700 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}
    </div>
  )
}

interface AuthSuccessProps {
  message: string
  subMessage?: string
}

export function AuthSuccess({ message, subMessage }: AuthSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className="relative">
        <div className="rounded-full h-12 w-12 bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {message}
        </h3>
        {subMessage && (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  )
}

interface AuthStepProps {
  step: number
  totalSteps: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
}

export function AuthStep({ step, totalSteps, title, description, isActive, isCompleted }: AuthStepProps) {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
      isActive ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 
      isCompleted ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
      'bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isCompleted ? 'bg-green-600 text-white' :
        isActive ? 'bg-orange-600 text-white' :
        'bg-stone-300 dark:bg-stone-600 text-stone-600 dark:text-stone-300'
      }`}>
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          step
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${
          isActive ? 'text-orange-900 dark:text-orange-100' :
          isCompleted ? 'text-green-900 dark:text-green-100' :
          'text-stone-700 dark:text-stone-300'
        }`}>
          {title}
        </h4>
        <p className={`text-xs mt-1 ${
          isActive ? 'text-orange-700 dark:text-orange-300' :
          isCompleted ? 'text-green-700 dark:text-green-300' :
          'text-stone-500 dark:text-stone-400'
        }`}>
          {description}
        </p>
      </div>
    </div>
  )
}
