"use client"

export const dynamic = 'force-dynamic'

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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function TailorsPage() {
  const [selectedTailor, setSelectedTailor] = useState<any>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const tailors = useQuery(api.users.getUsersByRole, { role: "tailor" })

  const filteredTailors = tailors?.filter(tailor =>
    !searchTerm ||
    tailor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tailor.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tailor.specialties?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

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
            <Input
              placeholder="Search by name, location, or specialty..."
              className="pl-9 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>

        {tailors === undefined ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredTailors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">No tailors found</p>
            <p className="text-stone-400 text-sm mt-1">Tailors will appear here once they sign up</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTailors.map((tailor) => (
              <Card key={tailor._id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={tailor.avatar || "/placeholder.svg"} alt={tailor.name} />
                      <AvatarFallback>{tailor.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-stone-900 dark:text-stone-100">{tailor.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                        <MapPin className="h-3 w-3" />
                        {tailor.location || "Kenya"}
                      </CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                          <span className="font-semibold text-stone-900 dark:text-stone-100">5.0</span>
                        </div>
                        <span className="text-sm text-stone-600 dark:text-stone-400">New tailor</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tailor.specialties?.length > 0 ? (
                      tailor.specialties.map((specialty: string) => (
                        <Badge key={specialty} variant="outline" className="dark:bg-stone-700 dark:text-stone-200 dark:border-stone-600">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Ankara Fashion</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                        <Award className="h-4 w-4" />
                        Experience
                      </div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {tailor.experience ? `${tailor.experience} years` : "New"}
                      </div>
                    </div>
                    <div>
                      <div className="text-stone-600 dark:text-stone-400">Status</div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {tailor.acceptingOrders !== false ? "✅ Accepting Orders" : "❌ Unavailable"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CustomModalTrigger onClick={() => setSelectedTailor(tailor)}>
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                        View Profile
                      </Button>
                    </CustomModalTrigger>

                    <CustomModal
                      isOpen={selectedTailor?._id === tailor._id && !showMessageModal}
                      onClose={() => setSelectedTailor(null)}
                      title={tailor.name}
                      description={tailor.bio || `Ankara fashion tailor based in ${tailor.location || "Kenya"}`}
                    >
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {tailor.specialties?.map((specialty: string) => (
                            <Badge key={specialty} variant="outline">{specialty}</Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Experience</div>
                            <div className="text-lg font-semibold">{tailor.experience ? `${tailor.experience} years` : "New"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Location</div>
                            <div className="text-lg font-semibold">{tailor.location || "Kenya"}</div>
                          </div>
                        </div>
                        {tailor.bio && (
                          <div>
                            <h4 className="font-semibold mb-1">About</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400">{tailor.bio}</p>
                          </div>
                        )}
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                          onClick={() => {
                            setSelectedTailor(null)
                            router.push(`/client/orders/new?tailorId=${tailor._id}&tailorName=${encodeURIComponent(tailor.name || "")}`)
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
                      isOpen={showMessageModal && selectedTailor?._id === tailor._id}
                      onClose={() => { setShowMessageModal(false); setSelectedTailor(null) }}
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
                            placeholder="Describe your design requirements..."
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
        )}
      </div>
    </DashboardLayout>
  )
}
