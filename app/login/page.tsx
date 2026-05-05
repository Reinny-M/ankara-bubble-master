"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSignIn, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { AuthLoading, AuthSuccess } from "@/components/ui/auth-loading"

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { user, isLoaded: userLoaded } = useUser()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetStep, setResetStep] = useState<'email' | 'code'>('email')

  useEffect(() => {
    if (userLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string || 'client'
      window.location.href = getDashboardUrl(userRole)
    }
  }, [user, userLoaded])

  const getDashboardUrl = (userRole: string) => {
    switch (userRole) {
      case 'client': return '/client/dashboard'
      case 'tailor': return '/tailor/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/client/dashboard'
    }
  }

  const getLoginLoadingMessage = () => {
    switch (loadingStep) {
      case 1: return 'Signing you in...'
      case 2: return 'Setting up your session...'
      case 3: return 'Welcome back!'
      default: return 'Please wait...'
    }
  }

  const getLoginLoadingSubMessage = () => {
    switch (loadingStep) {
      case 1: return 'Verifying your credentials'
      case 2: return 'Preparing your dashboard'
      case 3: return 'Redirecting to your dashboard'
      default: return 'Processing login'
    }
  }

  const getLoginProgressPercentage = () => Math.round((loadingStep / 3) * 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setIsLoading(true)
    setError('')
    setLoadingStep(1)
    try {
      setLoadingStep(1)
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        setLoadingStep(2)
        await setActive({ session: result.createdSessionId })
        setLoadingStep(3)
        setShowSuccess(true)
        setTimeout(() => {
          const userRole = user?.unsafeMetadata?.role as string || 'client'
          window.location.href = getDashboardUrl(userRole)
        }, 1500)
      } else {
        setError('Login failed. Please check your credentials.')
        setIsLoading(false)
        setLoadingStep(0)
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.'
      if (err.message) {
        if (err.message.includes("Couldn't find your account")) errorMessage = 'Account not found. Please check your email or create a new account.'
        else if (err.message.includes("Invalid password")) errorMessage = 'Incorrect password. Please try again.'
        else errorMessage = err.message
      } else if (err.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage
      }
      setError(errorMessage)
      setIsLoading(false)
      setLoadingStep(0)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setIsLoading(true)
    setError('')
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setResetStep('code')
      setResetSent(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        setShowSuccess(true)
        setTimeout(() => { window.location.href = '/client/dashboard' }, 1500)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Invalid code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size="lg" variant="full" />
          </Link>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <AuthLoading
                message={getLoginLoadingMessage()}
                subMessage={getLoginLoadingSubMessage()}
                showProgress={true}
                progress={getLoginProgressPercentage()}
              />
            </div>
          )}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <AuthSuccess message="Welcome Back!" subMessage="Redirecting to your dashboard..." />
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {forgotMode ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  {resetStep === 'email' ? 'Reset Password' : 'Enter Reset Code'}
                </h1>
                <p className="text-stone-600 dark:text-stone-400">
                  {resetStep === 'email' ? "We'll send a reset code to your email" : `Check your email for the code we sent to ${email}`}
                </p>
              </div>

              {resetStep === 'email' ? (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-10 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        required />
                    </div>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-sm text-red-600">{error}</p></div>}
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : 'Send Reset Code'}
                  </button>
                  <button type="button" onClick={() => setForgotMode(false)} className="w-full text-sm text-stone-600 hover:text-orange-600">
                    Back to Sign in
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Reset Code</label>
                    <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Enter the code from your email"
                      className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                      <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-3 pl-10 pr-10 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-sm text-red-600">{error}</p></div>}
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              {/* NORMAL LOGIN MODE */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Welcome back</h1>
                <p className="text-stone-600 dark:text-stone-400">Sign in to your account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 pl-10 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 transition-colors bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500"
                      required />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Password</label>
                    <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pl-10 pr-10 border border-stone-300 dark:border-stone-600 rounded-lg focus:border-orange-500 transition-colors bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500"
                      required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <button type="submit" disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><LogIn className="h-5 w-5" />Sign in</>}
                </button>
              </form>
              <div className="text-center mt-6">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">Create account</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
