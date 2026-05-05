"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-center text-white sm:p-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
        <p className="mb-8 text-lg text-orange-50">
          Get the latest Ankara fashion trends, tailor spotlights, and exclusive offers delivered to your inbox
        </p>
        {isSubmitted ? (
          <div className="rounded-lg bg-white/20 p-4">
            <p className="font-semibold">Thank you for subscribing!</p>
            <p className="text-sm text-orange-50">Check your email for confirmation</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/90 text-stone-900 placeholder:text-stone-500"
            />
            <Button type="submit" className="bg-white text-orange-600 hover:bg-stone-50">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
