"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Akinyi Odhiambo",
    role: "Fashion Enthusiast",
    location: "Nairobi, Kenya",
    image: "/kenyan-woman-portrait.jpg",
    rating: 5,
    text: "The AI stylist helped me find the perfect Ankara design for my wedding. The tailor was professional and delivered exactly what I wanted!",
  },
  {
    name: "Wanjiku Kamau",
    role: "Business Owner",
    location: "Mombasa, Kenya",
    image: "/kenyan-woman-professional.jpg",
    rating: 5,
    text: "As a tailor, Ankara Bubble has connected me with so many clients. The platform is easy to use and the commission is fair.",
  },
  {
    name: "Omondi Otieno",
    role: "Event Planner",
    location: "Kisumu, Kenya",
    image: "/kenyan-man-portrait.jpg",
    rating: 5,
    text: "I ordered matching Ankara outfits for my entire team. The quality was exceptional and the process was seamless from start to finish.",
  },
]

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-stone-900 dark:text-stone-100">What Our Users Say</h2>
        <p className="mx-auto max-w-2xl text-stone-600 dark:text-stone-400">
          Join thousands of satisfied clients and tailors across Kenya
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, i) => (
          <Card key={i} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-600 text-orange-600" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{testimonial.name}</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
