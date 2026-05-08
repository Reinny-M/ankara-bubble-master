"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/toast-context"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { ShoppingBag, ArrowLeft } from "lucide-react"

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tailorId = searchParams.get("tailorId")
  const tailorName = searchParams.get("tailorName") || "Selected Tailor"
  const { user } = useUser()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    designDescription: "",
    fabric: "",
    occasion: "",
    budget: "",
    deliveryDate: "",
    height: "",
    bust: "",
    waist: "",
    hips: "",
    notes: "",
  })

  const userData = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip")
  const createOrder = useMutation(api.orders.createOrder)

  const handleSubmit = async () => {
    if (!userData?._id) {
      toast({ title: "Error", description: "User not found. Please log in again.", variant: "destructive" })
      return
    }

    if (!form.designDescription || !form.budget || !form.height || !form.bust || !form.waist || !form.hips) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await createOrder({
        clientId: userData._id,
        tailorId: tailorId as any,
        amount: Number(form.budget),
        requirements: form.designDescription,
        measurements: {
          height: Number(form.height),
          bust: Number(form.bust),
          waist: Number(form.waist),
          hips: Number(form.hips),
        },
        notes: form.notes,
      })

      toast({ title: "Order Placed!", description: "Your order has been sent to the tailor." })
      router.push("/client/orders")
    } catch (error) {
      console.error("Error placing order:", error)
      toast({ title: "Failed", description: "Could not place order. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Place Order</h1>
            <p className="text-stone-600 dark:text-stone-400">Ordering from: <strong>{tailorName}</strong></p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Design Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Design Description *</Label>
              <Textarea
                placeholder="Describe the Ankara design you want (e.g. floor-length evening gown with peplum waist)"
                value={form.designDescription}
                onChange={(e) => setForm({ ...form, designDescription: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fabric Preference</Label>
                <Input
                  placeholder="e.g. Cotton Ankara"
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                />
              </div>
              <div>
                <Label>Occasion</Label>
                <Input
                  placeholder="e.g. Wedding, Office"
                  value={form.occasion}
                  onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Budget (KES) *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 15000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
              <div>
                <Label>Expected Delivery Date</Label>
                <Input
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height (cm) *</Label>
                <Input
                  type="number"
                  placeholder="165"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                />
              </div>
              <div>
                <Label>Bust (cm) *</Label>
                <Input
                  type="number"
                  placeholder="90"
                  value={form.bust}
                  onChange={(e) => setForm({ ...form, bust: e.target.value })}
                />
              </div>
              <div>
                <Label>Waist (cm) *</Label>
                <Input
                  type="number"
                  placeholder="75"
                  value={form.waist}
                  onChange={(e) => setForm({ ...form, waist: e.target.value })}
                />
              </div>
              <div>
                <Label>Hips (cm) *</Label>
                <Input
                  type="number"
                  placeholder="95"
                  value={form.hips}
                  onChange={(e) => setForm({ ...form, hips: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any other details for the tailor..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          <ShoppingBag className="h-4 w-4" />
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </DashboardLayout>
  )
}
