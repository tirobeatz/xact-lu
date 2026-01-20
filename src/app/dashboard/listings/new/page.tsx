"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { locations } from "@/lib/locations"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"

const propertyTypeKeys = ["apartment", "house", "villa", "penthouse", "studio", "duplex", "land", "commercial"] as const
const listingTypes = ["SALE", "RENT"]

const featureKeys = [
  "balcony",
  "terrace",
  "garden",
  "garage",
  "parking",
  "elevator",
  "cellar",
  "storage",
  "fireplace",
  "airConditioning",
  "pool",
  "furnished",
] as const

export default function NewListingPage() {
  const { t } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stepLabels = [
    t.dashboard.newListing.steps.basicInfo,
    t.dashboard.newListing.steps.location,
    t.dashboard.newListing.steps.details,
    t.dashboard.newListing.steps.photos,
    t.dashboard.newListing.steps.description,
  ]

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    listingType: "SALE",
    propertyType: "",
    price: "",
    
    // Location
    location: "",
    address: "",
    zipCode: "",
    
    // Details
    size: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    totalFloors: "",
    yearBuilt: "",
    energyClass: "",
    
    // Features
    selectedFeatures: [] as string[],
    
    // Description
    description: "",
    
    // Contact
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter(f => f !== feature)
        : [...prev.selectedFeatures, feature]
    }))
  }

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

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"))
    if (files.length > 0) {
      setPhotos(prev => [...prev, ...files].slice(0, 20))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"))
      setPhotos(prev => [...prev, ...files].slice(0, 20))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const movePhoto = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === photos.length - 1)
    ) return

    const newPhotos = [...photos]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newPhotos[index], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[index]]
    setPhotos(newPhotos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Map property type to database enum
      const propertyTypeMap: Record<string, string> = {
        apartment: "APARTMENT",
        house: "HOUSE",
        villa: "VILLA",
        penthouse: "PENTHOUSE",
        studio: "STUDIO",
        duplex: "DUPLEX",
        land: "LAND",
        commercial: "OFFICE",
      }

      // Upload images first if any
      let imageUrls: string[] = []
      if (photos.length > 0) {
        const uploadFormData = new FormData()
        photos.forEach((photo) => {
          uploadFormData.append("files", photo)
        })

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json()
          throw new Error(uploadError.error || "Failed to upload images")
        }

        const uploadResult = await uploadResponse.json()
        imageUrls = uploadResult.urls
      }

      // Create the property with uploaded image URLs
      const response = await fetch("/api/user/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: propertyTypeMap[formData.propertyType] || "APARTMENT",
          category: formData.propertyType === "commercial" ? "COMMERCIAL" : "RESIDENTIAL",
          listingType: formData.listingType,
          price: parseFloat(formData.price),
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          livingArea: formData.size,
          floor: formData.floor,
          totalFloors: formData.totalFloors,
          yearBuilt: formData.yearBuilt,
          energyClass: formData.energyClass,
          address: formData.address,
          city: formData.location,
          postalCode: formData.zipCode,
          features: formData.selectedFeatures,
          images: imageUrls,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create listing")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.propertyType && formData.price && formData.listingType
      case 2:
        return formData.location && formData.address
      case 3:
        return formData.size && formData.bedrooms
      case 4:
        return true // Photos optional for now until image upload is implemented
      case 5:
        return formData.description && formData.contactName && formData.contactEmail && formData.contactPhone
      default:
        return true
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-[#1A1A1A] mt-6">
              {t.dashboard.newListing.success.title}
            </h1>
            <p className="text-[#6B6B6B] mt-4">
              {t.dashboard.newListing.success.message}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/listings">
                <Button variant="outline" className="h-11 px-6 rounded-xl border-[#E8E6E3]">
                  {t.dashboard.newListing.success.viewListings}
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                  setPhotos([])
                  setFormData({
                    title: "",
                    listingType: "SALE",
                    propertyType: "",
                    price: "",
                    location: "",
                    address: "",
                    zipCode: "",
                    size: "",
                    bedrooms: "",
                    bathrooms: "",
                    floor: "",
                    totalFloors: "",
                    yearBuilt: "",
                    energyClass: "",
                    selectedFeatures: [],
                    description: "",
                    contactName: "",
                    contactEmail: "",
                    contactPhone: "",
                  })
                }}
                className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
              >
                {t.dashboard.newListing.success.addAnother}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              {t.dashboard.newListing.title}
            </h1>
            <p className="text-white/60 mt-2">
              {t.dashboard.newListing.subtitle}
            </p>

            {/* Progress Steps */}
            <div className="mt-8 flex items-center justify-between">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step > i + 1
                          ? "bg-[#B8926A] text-white"
                          : step === i + 1
                          ? "bg-white text-[#1A1A1A]"
                          : "bg-white/20 text-white/60"
                      }`}
                    >
                      {step > i + 1 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${
                      step === i + 1 ? "text-white" : "text-white/40"
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < 4 && (
                    <div className={`w-8 sm:w-16 h-[2px] mx-2 ${
                      step > i + 1 ? "bg-[#B8926A]" : "bg-white/20"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">{t.dashboard.newListing.step1.title}</h2>

                <div className="space-y-5">
                  {/* Listing Type Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                      {t.dashboard.newListing.step1.listingType} *
                    </label>
                    <div className="flex gap-3">
                      {listingTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, listingType: type })}
                          className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                            formData.listingType === type
                              ? "bg-[#1A1A1A] text-white"
                              : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
                          }`}
                        >
                          {type === "SALE" ? t.dashboard.newListing.step1.forSale : t.dashboard.newListing.step1.forRent}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step1.propertyTitle} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={t.dashboard.newListing.step1.propertyTitlePlaceholder}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step1.propertyType} *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {propertyTypeKeys.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: key })}
                          className={`h-11 px-4 rounded-xl text-sm font-medium transition-all ${
                            formData.propertyType === key
                              ? "bg-[#B8926A] text-white"
                              : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
                          }`}
                        >
                          {t.dashboard.newListing.propertyTypes[key]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {formData.listingType === "SALE" ? t.dashboard.newListing.step1.price : t.dashboard.newListing.step1.pricePerMonth} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">€</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder={formData.listingType === "SALE" ? "e.g. 750000" : "e.g. 2500"}
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">{t.dashboard.newListing.step2.title}</h2>

                <div className="space-y-5">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step2.cityArea} *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                    >
                      <option value="">{t.dashboard.newListing.step2.selectCityArea}</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step2.streetAddress} *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t.dashboard.newListing.step2.streetAddressPlaceholder}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                    />
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step2.zipCode}
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder={t.dashboard.newListing.step2.zipCodePlaceholder}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">{t.dashboard.newListing.step3.title}</h2>

                <div className="space-y-5">
                  {/* Size & Rooms */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step3.livingArea} *
                      </label>
                      <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="e.g. 120"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step3.bedrooms} *
                      </label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                      >
                        <option value="">{t.dashboard.newListing.step3.selectEnergyClass}</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step3.bathrooms}
                      </label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                      >
                        <option value="">{t.dashboard.newListing.step3.selectEnergyClass}</option>
                        {[1, 2, 3, 4, 5, "6+"].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Floors */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step3.floors}
                      </label>
                      <input
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step3.yearBuilt}
                      </label>
                      <input
                        type="text"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                        placeholder="e.g. 2015"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                  </div>

                  {/* Energy Class */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step3.energyClass}
                    </label>
                    <select
                      name="energyClass"
                      value={formData.energyClass}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                    >
                      <option value="">{t.dashboard.newListing.step3.selectEnergyClass}</option>
                      {["A", "B", "C", "D", "E", "F", "G", "I"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                      {t.dashboard.newListing.step3.features}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {featureKeys.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleFeature(key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.selectedFeatures.includes(key)
                              ? "bg-[#B8926A] text-white"
                              : "bg-[#F5F3EF] text-[#6B6B6B] hover:bg-[#E8E6E3]"
                          }`}
                        >
                          {t.dashboard.newListing.features[key]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">{t.dashboard.newListing.step4.title}</h2>
                <p className="text-[#6B6B6B] text-sm mb-6">
                  {t.dashboard.newListing.step4.uploadSubtitle}
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
                    {t.dashboard.newListing.step4.dragDrop}
                  </p>
                  <p className="text-[#6B6B6B] text-sm mt-1">
                    <span className="text-[#B8926A]">{t.dashboard.newListing.step4.browse}</span>
                  </p>
                  <p className="text-[#999] text-xs mt-2">
                    {t.dashboard.newListing.step4.minPhotos}
                  </p>
                </div>

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {photos.length} {t.dashboard.newListing.step4.photoCount}
                      </p>
                      {photos.length < 3 && (
                        <p className="text-sm text-amber-600">
                          Need at least {3 - photos.length} more
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className={`relative group aspect-square rounded-xl overflow-hidden bg-[#F5F3EF] ${
                            index === 0 ? "ring-2 ring-[#B8926A]" : ""
                          }`}
                        >
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-[#B8926A] text-white text-xs rounded-md">
                              Cover
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  movePhoto(index, "up")
                                }}
                                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#F5F3EF]"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {index < photos.length - 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  movePhoto(index, "down")
                                }}
                                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#F5F3EF]"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(index)
                              }}
                              className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Description & Contact */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Description */}
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">{t.dashboard.newListing.step5.title}</h2>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.newListing.step5.description} *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder={t.dashboard.newListing.step5.descriptionPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none placeholder:text-[#999]"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">{t.dashboard.newListing.step5.contactInfo}</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.dashboard.newListing.step5.name} *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.dashboard.newListing.step5.email} *
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.dashboard.newListing.step5.phone} *
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          placeholder="+352 621 123 456"
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="h-12 px-6 rounded-xl border-[#E8E6E3]"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t.dashboard.newListing.navigation.back}
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="h-12 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.dashboard.newListing.navigation.continue}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid() || submitting}
                  className="h-12 px-8 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    t.dashboard.newListing.navigation.submitListing
                  )}
                </Button>
              )}
            </div>

            {/* Step indicator for mobile */}
            <p className="text-center text-[#6B6B6B] text-sm mt-6">
              Step {step} of 5
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}