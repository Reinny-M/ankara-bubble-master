"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomTagInput } from "@/components/ui/custom-tag-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { useToast } from "@/components/toast-context"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Upload, X, Plus, Save } from "lucide-react"
import Image from "next/image"

interface DesignFormProps {
  tailorId: string
  onSuccess?: () => void
  onCancel?: () => void
  editDesign?: any
}

const categories = [
  "Business Wear",
  "Casual Wear", 
  "Formal Wear",
  "Traditional",
  "Modern Fusion",
  "Evening Wear",
  "Wedding",
  "Cultural"
]

const occasions = [
  "Professional",
  "Casual",
  "Formal",
  "Traditional",
  "Modern",
  "Evening",
  "Wedding",
  "Cultural",
  "Party",
  "Office"
]

const bodyTypes = [
  "Hourglass",
  "Rectangle", 
  "Inverted Triangle",
  "Pear",
  "Apple",
  "Oval"
]

const fabrics = [
  "Cotton Ankara",
  "Premium Ankara Wax",
  "Structured Ankara",
  "Silk Ankara",
  "Linen Ankara",
  "Chiffon Ankara",
  "Velvet Ankara",
  "Denim Ankara"
]

export function DesignForm({ tailorId, onSuccess, onCancel, editDesign }: DesignFormProps) {
  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const createDesign = useMutation(api.designs.createDesign)
  const updateDesign = useMutation(api.designs.updateDesign)
  
  // Fetch design data with proper image URL when editing
  const designData = useQuery(
    api.designs.getDesign, 
    editDesign?._id ? { id: editDesign._id } : "skip"
  )
  
  const [formData, setFormData] = useState({
    title: editDesign?.title || "",
    description: editDesign?.description || "",
    price: editDesign?.price || 0,
    category: editDesign?.category || "",
    occasion: editDesign?.occasion || "",
    bodyType: editDesign?.bodyType || "",
    fabric: editDesign?.fabric || "",
    materials: editDesign?.materials || [],
    colors: editDesign?.colors || [],
    sizes: editDesign?.sizes || [],
    tags: editDesign?.tags || [],
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(designData?.imageUrl || null)
  const [isUploading, setIsUploading] = useState(false)

  // Update imagePreview when designData loads
  useEffect(() => {
    if (designData?.imageUrl) {
      setImagePreview(designData.imageUrl)
    }
  }, [designData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      let imageId = editDesign?.image
      
      // Upload image if new file selected
      if (imageFile) {
        const uploadUrl = await generateUploadUrl()
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        })
        const { storageId } = await uploadResponse.json()
        imageId = storageId
      }
      
      if (editDesign) {
        // Update existing design
        await updateDesign({
          id: editDesign._id,
          tailorId: tailorId as any,
          title: formData.title,
          description: formData.description,
          image: imageId,
          price: formData.price,
          category: formData.category,
          occasion: formData.occasion,
          bodyType: formData.bodyType,
          fabric: formData.fabric,
          materials: formData.materials,
          colors: formData.colors,
          sizes: formData.sizes,
          tags: formData.tags,
        })
        
        toast({
          title: "Design updated",
          description: "Your design has been updated successfully.",
        })
      } else {
        // Create new design
        await createDesign({
          title: formData.title,
          description: formData.description,
          image: imageId,
          price: formData.price,
          category: formData.category,
          occasion: formData.occasion,
          bodyType: formData.bodyType,
          fabric: formData.fabric,
          tailorId: tailorId as any,
          materials: formData.materials,
          colors: formData.colors,
          sizes: formData.sizes,
          tags: formData.tags,
        })
        
        toast({
          title: "Design created",
          description: "Your design has been added to your portfolio.",
        })
      }
      
      onSuccess?.()
    } catch (error) {
      console.error('Error saving design:', error)
      toast({
        title: "Error",
        description: "Failed to save design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{editDesign ? "Edit Design" : "Add New Design"}</CardTitle>
        <CardDescription>
          {editDesign ? "Update your design details" : "Create a new design for your portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Design Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-800"
                >
                  <Upload className="h-4 w-4" />
                  Choose Image
                </Label>
              </div>
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Design Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Elegant Evening Gown"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                onFocus={(e) => e.target.select()}
                placeholder="25000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your design, materials used, and special features..."
              rows={4}
              required
            />
          </div>

          {/* Design Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <CustomSelect
                placeholder="Select category"
                value={formData.category}
                options={categories.map(category => ({ value: category, label: category }))}
                onValueChange={(value) => setFormData({...formData, category: value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Occasion</Label>
              <CustomSelect
                placeholder="Select occasion"
                value={formData.occasion}
                options={occasions.map(occasion => ({ value: occasion, label: occasion }))}
                onValueChange={(value) => setFormData({...formData, occasion: value})}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Body Type</Label>
              <CustomSelect
                placeholder="Select body type"
                value={formData.bodyType}
                options={bodyTypes.map(bodyType => ({ value: bodyType, label: bodyType }))}
                onValueChange={(value) => setFormData({...formData, bodyType: value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Fabric</Label>
              <CustomSelect
                placeholder="Select fabric"
                value={formData.fabric}
                options={fabrics.map(fabric => ({ value: fabric, label: fabric }))}
                onValueChange={(value) => setFormData({...formData, fabric: value})}
              />
            </div>
          </div>

           {/* Materials */}
           <CustomTagInput
             label="Materials"
             placeholder="Add material..."
             value={formData.materials}
             onChange={(materials) => setFormData({...formData, materials})}
           />

           {/* Colors */}
           <CustomTagInput
             label="Colors"
             placeholder="Add color..."
             value={formData.colors}
             onChange={(colors) => setFormData({...formData, colors})}
           />

           {/* Sizes */}
           <CustomTagInput
             label="Available Sizes"
             placeholder="Add size..."
             value={formData.sizes}
             onChange={(sizes) => setFormData({...formData, sizes})}
           />

           {/* Tags */}
           <CustomTagInput
             label="Tags"
             placeholder="Add tag..."
             value={formData.tags}
             onChange={(tags) => setFormData({...formData, tags})}
           />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="bg-orange-600 hover:bg-orange-700">
              <Save className="mr-2 h-4 w-4" />
              {isUploading ? 'Saving...' : (editDesign ? 'Update Design' : 'Create Design')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
