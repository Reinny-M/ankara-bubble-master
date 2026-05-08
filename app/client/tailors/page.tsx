"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomModal, CustomModalTrigger } from "@/components/ui/custom-modal"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MapPin, Award, Search, ShoppingBag } from "lucide-react"
import { mockTailors } from "@/lib/mockData"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TailorsPage() {
  const [selectedTailor, setSelectedTailor] = useState<(typeof mockTailors)[0] | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const router = useRouter()

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Browse Tailors</h1>
          <p className="text-stone-600 dark:text-stone-400">Find expert Ankara fashion tailors for your next design</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input placeholder="Search by name, location, or specialty..." className="pl-9 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400" />
          </div>
          <Button variant="outline">Filters</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockTailors.map((tailor) => (
            <Card key={tailor.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={tailor.avatar || "/placeholder.svg"} alt={tailor.name} />
                    <AvatarFallback>{tailor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-stone-900 dark:text-stone-100">{tailor.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <MapPin className="h-3 w-3" />
                      {tailor.location}
                    </CardDescription>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                        <span className="font-semibold text-stone-900 dark:text-stone-100">{tailor.rating}</span>
                      </div>
                      <span className="text-sm text-stone-600 dark:text-stone-400">({tailor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tailor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="dark:bg-stone-700 dark:text-stone-200 dark:border-stone-600">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <Award className="h-4 w-4" />
                      Experience
                    </div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {tailor.yearsExperience} years
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-600 dark:text-stone-400">Completed Orders</div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{tailor.completedOrders}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CustomModalTrigger
                    onClick={() => {
                      setSelectedTailor(tailor)
                    }}
                  >
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                      View Profile
                    </Button>
                  </CustomModalTrigger>

                  <CustomModal
                    isOpen={selectedTailor?.id === tailor.id && !showMessageModal}
                    onClose={() => setSelectedTailor(null)}
                    title={tailor.name}
                    description={`Experienced Ankara fashion tailor specializing in ${tailor.specialties.join(", ")}. Known for attention to detail and timely delivery.`}
                  >
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                          <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                            {tailor.rating}
                          </span>
                        </div>
                        <span className="text-stone-600 dark:text-stone-400">({tailor.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tailor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="dark:bg-stone-700 dark:text-stone-200 dark:border-stone-600">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-stone-600 dark:text-stone-400">Experience</div>
                          <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                            {tailor.yearsExperience} years
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-stone-600 dark:text-stone-400">Completed Orders</div>
                          <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                            {tailor.completedOrders}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-stone-900 dark:text-stone-100">About</h4>
                        <p className="text-stone-600 dark:text-stone-400">
                          Experienced Ankara fashion tailor specializing in {tailor.specialties.join(", ")}. Known
                          for attention to detail and timely delivery.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                        onClick={() => {
                          setSelectedTailor(null)
                          router.push(`/client/orders/new?tailorId=${tailor.id}&tailorName=${encodeURIComponent(tailor.name)}`)
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Order Now
                      </Button>
                    </div>
                  </CustomModal>

                  <CustomModalTrigger
                    onClick={() => {
                      setSelectedTailor(tailor)
                      setShowMessageModal(true)
                    }}
                  >
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Message
                    </Button>
                  </CustomModalTrigger>

                  <CustomModal
                    isOpen={showMessageModal && selectedTailor?.id === tailor.id}
                    onClose={() => {
                      setShowMessageModal(false)
                      setSelectedTailor(null)
                    }}
                    title={`Send Message to ${tailor.name}`}
                    description="Describe your design requirements and the tailor will get back to you."
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="e.g., Custom Evening Gown" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Describe your design requirements, preferred fabrics, timeline, etc."
                          rows={5}
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">Send Message</Button>
                    </div>
                  </CustomModal>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
