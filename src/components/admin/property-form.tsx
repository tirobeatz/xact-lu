"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { locations } from "@/lib/locations"

// Enums matching Prisma schema
const propertyTypes = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "STUDIO", label: "Studio" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "TRIPLEX", label: "Triplex" },
  { value: "LOFT", label: "Loft" },
  { value: "OFFICE", label: "Office" },
  { value: "RETAIL", label: "Retail" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "LAND", label: "Land" },
  { value: "PARKING", label: "Parking" },
  { value: "OTHER", label: "Other" },
]

const propertyCategories = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "LAND", label: "Land" },
]

const propertyStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "REJECTED", label: "Rejected" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" },
  { value: "EXPIRED", label: "Expired" },
  { value: "ARCHIVED", label: "Archived" },
]

const listingTypes = [
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
]

const energyClasses = [
  { value: "A_PLUS_PLUS", label: "A++" },
  { value: "A_PLUS", label: "A+" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
]

const heatingTypes = [
  "Gas",
  "Electric",
  "Oil",
  "Heat Pump",
  "Solar",
  "Wood/Pellet",
  "District Heating",
  "Other",
]

const propertyFeatures = [
  "Balcony",
  "Terrace",
  "Garden",
  "Garage",
  "Parking",
  "Elevator",
  "Cellar",
  "Attic",
  "Fireplace",
  "Air Conditioning",
  "Alarm System",
  "Swimming Pool",
  "Sauna",
  "Home Office",
  "Furnished",
  "Recently Renovated",
  "Double Glazing",
  "Solar Panels",
  "Underfloor Heating",
  "Smart Home",
  "Wheelchair Accessible",
  "Storage Room",
  "Laundry Room",
  "Wine Cellar",
]

interface PropertyImage {
  url: string
  alt: string
  isFloorplan: boolean
  file?: File
  preview?: string
}

interface PropertyFormData {
  title: string
  slug: string
  description: string
  type: string
  category: string
  status: string
  listingType: string
  price: string
  charges: string
  bedrooms: string
  bathrooms: string
  rooms: string
  livingArea: string
  landArea: string
  floor: string
  totalFloors: string
  yearBuilt: string
  energyClass: string
  heatingType: string
  address: string
  city: string
  postalCode: string
  neighborhood: string
  features: string[]
  isFeatured: boolean
  images: PropertyImage[]
  agentId: string
}

interface Agent {
  id: string
  name: string
  email: string
  image: string | null
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>
  propertyId?: string
  mode?: "create" | "edit"
  agents?: Agent[]
}

export function PropertyForm({ initialData, propertyId, mode = "create", agents = [] }: PropertyFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("basic")
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    type: initialData?.type || "",
    category: initialData?.category || "RESIDENTIAL",
    status: initialData?.status || "DRAFT",
    listingType: initialData?.listingType || "SALE",
    price: initialData?.price || "",
    charges: initialData?.charges || "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
    rooms: initialData?.rooms || "",
    livingArea: initialData?.livingArea || "",
    landArea: initialData?.landArea || "",
    floor: initialData?.floor || "",
    totalFloors: initialData?.totalFloors || "",
    yearBuilt: initialData?.yearBuilt || "",
    energyClass: initialData?.energyClass || "",
    heatingType: initialData?.heatingType || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postalCode: initialData?.postalCode || "",
    neighborhood: initialData?.neighborhood || "",
    features: initialData?.features || [],
    isFeatured: initialData?.isFeatured || false,
    images: initialData?.images || [],
    agentId: initialData?.agentId || "",
  })

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Auto-generate slug when title changes
    if (name === "title" && mode === "create") {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    }
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  // Image handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )
    addImages(files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      )
      addImages(files)
    }
  }

  const addImages = (files: File[]) => {
    const newImages: PropertyImage[] = files.map((file) => ({
      url: "", // Will be set after upload
      alt: "",
      isFloorplan: false,
      file,
      preview: URL.createObjectURL(file),
    }))

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 20),
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.images.length - 1)
    )
      return

    const newImages = [...formData.images]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]]
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const toggleFloorplan = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, isFloorplan: !img.isFloorplan } : img
      ),
    }))
  }

  const updateImageAlt = (index: number, alt: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, alt } : img)),
    }))
  }

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Title is required"
    if (!formData.slug.trim()) return "Slug is required"
    if (!formData.description.trim()) return "Description is required"
    if (!formData.type) return "Property type is required"
    if (!formData.category) return "Category is required"
    if (!formData.listingType) return "Listing type is required"
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required"
    if (!formData.address.trim()) return "Address is required"
    if (!formData.city) return "City is required"
    if (!formData.postalCode.trim()) return "Postal code is required"
    if (formData.images.length < 1) return "At least one image is required"
    return null
  }

  // Upload images to server (placeholder - integrate with your upload service)
  const uploadImages = async (): Promise<PropertyImage[]> => {
    // For now, we'll use placeholder URLs
    // In production, integrate with Uploadthing or your preferred service
    const uploadedImages: PropertyImage[] = []

    for (const image of formData.images) {
      if (image.file) {
        // Placeholder: In production, upload to your service
        // const formData = new FormData()
        // formData.append('file', image.file)
        // const response = await fetch('/api/upload', { method: 'POST', body: formData })
        // const { url } = await response.json()

        // For demo, use the preview URL or a placeholder
        uploadedImages.push({
          url: image.preview || `https://picsum.photos/800/600?random=${Math.random()}`,
          alt: image.alt || formData.title,
          isFloorplan: image.isFloorplan,
        })
      } else {
        // Existing image (edit mode)
        uploadedImages.push({
          url: image.url,
          alt: image.alt,
          isFloorplan: image.isFloorplan,
        })
      }
    }

    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images first
      const uploadedImages = await uploadImages()

      // Prepare data for API
      const apiData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        status: formData.status,
        listingType: formData.listingType,
        price: parseFloat(formData.price),
        charges: formData.charges ? parseFloat(formData.charges) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        livingArea: formData.livingArea ? parseFloat(formData.livingArea) : null,
        landArea: formData.landArea ? parseFloat(formData.landArea) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        energyClass: formData.energyClass || null,
        heatingType: formData.heatingType || null,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        neighborhood: formData.neighborhood || null,
        features: formData.features,
        isFeatured: formData.isFeatured,
        images: uploadedImages,
        agentId: formData.agentId || null,
      }

      const url = mode === "edit"
        ? `/api/admin/properties/${propertyId}`
        : "/api/admin/properties"

      const method = mode === "edit" ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save property")
      }

      router.push("/admin/properties")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "location", label: "Location", icon: "📍" },
    { id: "details", label: "Details", icon: "🏠" },
    { id: "features", label: "Features", icon: "✨" },
    { id: "images", label: "Images", icon: "📷" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Section Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === "basic" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Basic Information</h2>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Listing Type *
            </label>
            <div className="flex gap-3">
              {listingTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, listingType: type.value }))}
                  className={`flex-1 h-11 rounded-xl font-medium transition-all ${
                    formData.listingType === type.value
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern 3-Bedroom Apartment with Terrace"
              className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[#6B6B6B] text-sm">/properties/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="modern-3-bedroom-apartment"
                className="flex-1 h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
          </div>

          {/* Property Type & Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Property Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select type</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                {propertyCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Charges */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {formData.listingType === "SALE" ? "Sale Price" : "Monthly Rent"} (€) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">€</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="750000"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Monthly Charges (€)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">€</span>
                <input
                  type="number"
                  name="charges"
                  value={formData.charges}
                  onChange={handleChange}
                  placeholder="250"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the property in detail..."
              className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none"
            />
          </div>
        </div>
      )}

      {/* Location Section */}
      {activeSection === "location" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Location</h2>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              City / Area *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
            >
              <option value="">Select city</option>
              {locations.filter(l => l !== "All").map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Street Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 12 Rue de la Gare"
              className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
            />
          </div>

          {/* Postal Code & Neighborhood */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="L-1234"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="e.g. City Center"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Details Section */}
      {activeSection === "details" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Property Details</h2>

          {/* Size */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Living Area (m²)
              </label>
              <input
                type="number"
                name="livingArea"
                value={formData.livingArea}
                onChange={handleChange}
                placeholder="120"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Land Area (m²)
              </label>
              <input
                type="number"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                placeholder="500"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
          </div>

          {/* Rooms */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Rooms
              </label>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Bathrooms
              </label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Floors */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Floor
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="3"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Total Floors
              </label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleChange}
                placeholder="5"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
          </div>

          {/* Year Built & Energy */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="2020"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Energy Class
              </label>
              <select
                name="energyClass"
                value={formData.energyClass}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select</option>
                {energyClasses.map((ec) => (
                  <option key={ec.value} value={ec.value}>
                    {ec.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Heating Type
              </label>
              <select
                name="heatingType"
                value={formData.heatingType}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Select</option>
                {heatingTypes.map((ht) => (
                  <option key={ht} value={ht}>
                    {ht}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {activeSection === "features" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Features & Amenities</h2>
          <p className="text-[#6B6B6B] text-sm mb-4">
            Select all features that apply to this property.
          </p>

          <div className="flex flex-wrap gap-2">
            {propertyFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.features.includes(feature)
                    ? "bg-[#B8926A] text-white"
                    : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
                }`}
              >
                {feature}
              </button>
            ))}
          </div>

          {formData.features.length > 0 && (
            <p className="mt-4 text-sm text-[#6B6B6B]">
              {formData.features.length} feature{formData.features.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      )}

      {/* Images Section */}
      {activeSection === "images" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">Property Images</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">
            Upload high-quality images. The first image will be used as the cover.
          </p>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-[#B8926A] bg-[#B8926A]/5"
                : "border-[#E8E6E3] hover:border-[#B8926A]/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#1A1A1A] font-medium mt-4">
              Drag & drop images here
            </p>
            <p className="text-[#6B6B6B] text-sm mt-1">
              or <span className="text-[#B8926A]">browse</span> to upload
            </p>
            <p className="text-[#999] text-xs mt-2">
              JPG, PNG up to 10MB each · Max 20 images
            </p>
          </div>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {formData.images.length} image{formData.images.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-xl overflow-hidden bg-[#F5F3EF] ${
                      index === 0 ? "ring-2 ring-[#B8926A]" : ""
                    }`}
                  >
                    <div className="aspect-square">
                      <img
                        src={image.preview || image.url}
                        alt={image.alt || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-[#B8926A] text-white text-xs rounded-md">
                          Cover
                        </span>
                      )}
                      {image.isFloorplan && (
                        <span className="px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded-md">
                          Floorplan
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, "up")}
                          className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#F5F3EF]"
                          title="Move left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {index < formData.images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, "down")}
                          className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#F5F3EF]"
                          title="Move right"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleFloorplan(index)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          image.isFloorplan ? "bg-[#1A1A1A] text-white" : "bg-white hover:bg-[#F5F3EF]"
                        }`}
                        title="Mark as floorplan"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                        title="Remove"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Alt Text Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                        placeholder="Alt text..."
                        className="w-full px-2 py-1 text-xs bg-white/90 rounded text-[#1A1A1A] outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Publishing Settings</h2>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
            >
              {propertyStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Set to "Published" to make this property visible on the website.
            </p>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#F5F3EF] rounded-xl">
            <div>
              <p className="font-medium text-[#1A1A1A]">Featured Property</p>
              <p className="text-sm text-[#6B6B6B]">
                Show this property in featured sections
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E8E6E3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B8926A]"></div>
            </label>
          </div>

          {/* Assigned Agent */}
          {agents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Assigned Agent
              </label>
              <select
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
              >
                <option value="">Xact Real Estate (Default)</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Select an agent to display as the contact for this property.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 px-6 rounded-xl"
        >
          Cancel
        </Button>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData((prev) => ({ ...prev, status: "DRAFT" }))
            }}
            disabled={isSubmitting}
            className="h-11 px-6 rounded-xl"
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-8 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : mode === "edit" ? (
              "Update Property"
            ) : (
              "Create Property"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
