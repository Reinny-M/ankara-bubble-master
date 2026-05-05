"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSignUp, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { User, Eye, EyeOff, UserPlus, Mail, Shield, CheckCircle } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { AuthLoading, AuthSuccess, AuthStep } from "@/components/ui/auth-loading"

const roles = [
  {
    value: "client",
    label: "Client",
    description: "Find tailors and order custom designs",
    color: "from-blue-500 to-blue-600",
  },
  {
    value: "tailor",
    label: "Tailor",
    description: "Showcase your skills and get clients",
    color: "from-green-500 to-green-600",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Platform administration",
    color: "from-red-500 to-red-600",
  },
]

export default function SignupPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const { user, isLoaded: userLoaded } = useUser()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('client')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // Redirect if user is already signed in
  useEffect(() => {
    if (userLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string || 'client'
      const dashboardUrl = getDashboardUrl(userRole)
      router.push(dashboardUrl)
    }
  }, [user, userLoaded, router])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResendCode = async () => {
    if (!isLoaded || !signUp || resendCooldown > 0) return
    
    setIsResending(true)
    setError('')
    
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setResendCooldown(60) // 60 second cooldown
      setError('') // Clear any previous errors
    } catch (err: any) {
      console.error('Resend code error:', err)
      
      let errorMessage = 'Failed to resend code. Please try again.'
      
      if (err.message) {
        if (err.message.includes("too_many_requests")) {
          errorMessage = 'Too many requests. Please wait before requesting another code.'
        } else if (err.message.includes("email_address_invalid")) {
          errorMessage = 'Invalid email address. Please contact support.'
        } else {
          errorMessage = err.message
        }
      } else if (err.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage
      } else if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message
      }
      
      setError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  const getDashboardUrl = (userRole: string) => {
    switch (userRole) {
      case 'client':
        return '/client/dashboard'
      case 'tailor':
        return '/tailor/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/client/dashboard'
    }
  }

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Creating your account...'
      case 2:
        return 'Sending verification email...'
      case 3:
        return 'Finalizing setup...'
      case 4:
        return 'Account created successfully!'
      default:
        return 'Please wait...'
    }
  }

  const getLoadingSubMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Setting up your profile and preferences'
      case 2:
        return 'Check your email for the verification code'
      case 3:
        return 'Almost done!'
      case 4:
        return 'Redirecting to your dashboard'
      default:
        return 'Processing your request'
    }
  }

  const getProgressPercentage = () => {
    return Math.round((loadingStep / 4) * 100)
  }

  const getVerificationLoadingMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Verifying your code...'
      case 2:
        return 'Setting up your session...'
      case 3:
        return 'Welcome to Ankara Bubble!'
      default:
        return 'Please wait...'
    }
  }

  const getVerificationLoadingSubMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Checking verification code'
      case 2:
        return 'Preparing your dashboard'
      case 3:
        return 'Redirecting to your dashboard'
      default:
        return 'Processing verification'
    }
  }

  const getVerificationProgressPercentage = () => {
    return Math.round((loadingStep / 3) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')
    setLoadingStep(1)

    try {
      // Step 1: Creating account
      setLoadingStep(1)
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          role: selectedRole,
        }
      })

      if (result.status === 'missing_requirements') {
        // Step 2: Preparing email verification
        setLoadingStep(2)
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        
        // Step 3: Show success and transition to verification
        setLoadingStep(3)
        setTimeout(() => {
          setIsVerifying(true)
          setIsLoading(false)
        }, 1000)
      } else if (result.status === 'complete') {
        // Step 3: Setting active session
        setLoadingStep(3)
        await setActive({ session: result.createdSessionId })
        
        // Step 4: Success
        setLoadingStep(4)
        setShowSuccess(true)
        setTimeout(() => {
          // Force refresh to get latest user data
          window.location.href = getDashboardUrl(selectedRole)
        }, 1500)
      }
    } catch (err: any) {
      console.error('Clerk signup error:', err)
      
      // Handle specific Clerk signup error messages
      let errorMessage = 'An error occurred. Please try again.'
      
      if (err.message) {
        if (err.message.includes("email_address_invalid")) {
          errorMessage = 'Please enter a valid email address.'
        } else if (err.message.includes("password_too_short")) {
          errorMessage = 'Password is too short. Please choose a password with at least 8 characters.'
        } else if (err.message.includes("password_too_weak")) {
          errorMessage = 'Password is too weak. Please choose a stronger password with a mix of letters, numbers, and symbols.'
        } else if (err.message.includes("password_pwned")) {
          errorMessage = 'This password has been found in an online data breach. Please choose a stronger, unique password for your security.'
        } else if (err.message.includes("email_address_exists")) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.'
        } else if (err.message.includes("form_password_incorrect")) {
          errorMessage = 'Password does not meet requirements. Please choose a stronger password.'
        } else if (err.message.includes("form_email_address_invalid")) {
          errorMessage = 'Please enter a valid email address.'
        } else if (err.message.includes("form_password_too_short")) {
          errorMessage = 'Password is too short. Please choose a password with at least 8 characters.'
        } else if (err.message.includes("form_password_too_weak")) {
          errorMessage = 'Password is too weak. Please choose a stronger password.'
        } else if (err.message.includes("form_password_pwned")) {
          errorMessage = 'This password has been found in an online data breach. Please choose a stronger, unique password for your security.'
        } else {
          errorMessage = err.message
        }
      } else if (err.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage
      } else if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message
      }
      
      setError(errorMessage)
      setIsLoading(false)
      setLoadingStep(0)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')
    setLoadingStep(1)

    try {
      // Step 1: Verifying code
      setLoadingStep(1)
      const result = await signUp.attemptEmailAddressVerification({
        code: (e.target as any).code.value
      })

      if (result.status === 'complete') {
        // Step 2: Setting active session
        setLoadingStep(2)
        await setActive({ session: result.createdSessionId })
        
        // Step 3: Success
        setLoadingStep(3)
        setShowSuccess(true)
        setTimeout(() => {
          // Force refresh to get latest user data
          window.location.href = getDashboardUrl(selectedRole)
        }, 1500)
      } else {
        setError('Verification failed. Please try again.')
        setIsLoading(false)
        setLoadingStep(0)
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      
      // Handle specific Clerk verification error messages
      let errorMessage = 'Invalid verification code.'
      
      if (err.message) {
        if (err.message.includes("code_incorrect")) {
          errorMessage = 'Invalid verification code. Please check the code and try again.'
        } else if (err.message.includes("code_expired")) {
          errorMessage = 'Verification code has expired. Please request a new code using the button below.'
        } else if (err.message.includes("code_invalid")) {
          errorMessage = 'Invalid verification code format. Please check the code.'
        } else if (err.message.includes("too_many_requests")) {
          errorMessage = 'Too many attempts. Please wait a moment before trying again.'
        } else if (err.message.includes("This verification has expired")) {
          errorMessage = 'Verification code has expired. Please request a new code using the button below.'
        } else {
          errorMessage = err.message
        }
      } else if (err.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage
      } else if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message
      }
      
      setError(errorMessage)
      setIsLoading(false)
      setLoadingStep(0)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">Ankara Bubble</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-8 relative">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                <AuthLoading 
                  message={getVerificationLoadingMessage()}
                  subMessage={getVerificationLoadingSubMessage()}
                  showProgress={true}
                  progress={getVerificationProgressPercentage()}
                />
              </div>
            )}

            {/* Success Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                <AuthSuccess 
                  message="Email Verified Successfully!"
                  subMessage="Redirecting to your dashboard..."
                />
              </div>
            )}

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Verify your email</h1>
              <p className="text-stone-600 dark:text-stone-400">We sent a verification code to <span className="font-medium">{email}</span></p>
            </div>

            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Verification code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Enter verification code"
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-colors bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || resendCooldown > 0}
                  className="text-orange-600 hover:text-orange-700 disabled:text-stone-400 dark:text-orange-400 dark:hover:text-orange-300 dark:disabled:text-stone-500 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  {isResending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 dark:border-orange-400"></div>
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend code in ${resendCooldown}s`
                  ) : (
                    'Resend verification code'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size="md" variant="full" />
          </Link>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <div className="text-center">
                <AuthLoading 
                  message={getLoadingMessage()}
                  subMessage={getLoadingSubMessage()}
                  showProgress={true}
                  progress={getProgressPercentage()}
                />
                
                {/* Progress Steps */}
                <div className="mt-6 space-y-2 max-w-xs mx-auto">
                  <AuthStep
                    step={1}
                    totalSteps={4}
                    title="Creating Account"
                    description="Setting up your profile"
                    isActive={loadingStep === 1}
                    isCompleted={loadingStep > 1}
                  />
                  <AuthStep
                    step={2}
                    totalSteps={4}
                    title="Sending Verification"
                    description="Preparing email verification"
                    isActive={loadingStep === 2}
                    isCompleted={loadingStep > 2}
                  />
                  <AuthStep
                    step={3}
                    totalSteps={4}
                    title="Finalizing"
                    description="Completing setup"
                    isActive={loadingStep === 3}
                    isCompleted={loadingStep > 3}
                  />
                  <AuthStep
                    step={4}
                    totalSteps={4}
                    title="Success"
                    description="Account created successfully"
                    isActive={loadingStep === 4}
                    isCompleted={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <AuthSuccess 
                message="Account Created Successfully!"
                subMessage="Redirecting to your dashboard..."
              />
            </div>
          )}
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">Create your account</h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">Join the Ankara fashion community</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
              I am a
            </label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => {
                const isSelected = selectedRole === role.value
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                        : 'border-stone-200 dark:border-stone-600 hover:border-stone-300 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center shrink-0`}>
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{role.label}</div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{role.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-colors text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-colors text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Email address
              </label>
              <input
                  id="email"
                  type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-colors text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
                  required
                />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-colors text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}