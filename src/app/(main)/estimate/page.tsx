"use client"

import { useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { locations } from "@/lib/locations"

const propertyTypes = ["Apartment", "House", "Villa", "Penthouse", "Studio", "Duplex", "Land", "Commercial"]
const conditions = ["New / Renovated", "Good condition", "Needs light refresh", "Needs full renovation"]

const benefits = [
  { icon: "📈", title: "Know Your True Value", desc: "Don't leave money on the table — get an accurate market price" },
  { icon: "⏱️", title: "24h Expert Response", desc: "Personal call from a local agent who knows your area" },
  { icon: "🔒", title: "100% Confidential", desc: "Your information stays private, no spam, no pressure" },
  { icon: "🆓", title: "Completely Free", desc: "No fees, no obligations, no strings attached" },
]

const testimonials = [
  {
    quote: "Xact valued my apartment 15% higher than another agency. They were right — it sold in 3 weeks at that price.",
    name: "Marie L.",
    location: "Kirchberg",
  },
  {
    quote: "Fast, professional, and honest. They told me exactly what to expect and delivered.",
    name: "Thomas K.",
    location: "Belair",
  },
]

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function EstimatePage() {
  const reduce = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    address: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    condition: "",
    floor: "",
    parking: "",
    outdoor: "",
    extras: "",
    name: "",
    email: "",
    phone: "",
    timeline: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
      setPhotos(prev => [...prev, ...files].slice(0, 10))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"))
      setPhotos(prev => [...prev, ...files].slice(0, 10))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send formData + photos to your backend
    console.log({ ...formData, photos })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#FAFAF8] pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-[#B8926A]/10 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-6">
            Request received!
          </h1>
          <p className="text-[#6B6B6B] mt-4 max-w-md mx-auto">
            Thank you for your interest. One of our agents will contact you within 24 hours with a personalized valuation.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setPhotos([])
            }}
            variant="outline"
            className="mt-8 h-11 px-6 rounded-xl border-[#E8E6E3]"
          >
            Submit another request
          </Button>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0F0F10] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#B8926A]/15 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#B8926A]/10 blur-3xl"
            animate={reduce ? undefined : { scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#B8926A]" />
                FREE VALUATION
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-6 leading-tight">
                Your property could be worth
                <span className="block text-[#B8926A]">more than you think.</span>
              </h1>

              <p className="text-white/60 mt-6 text-lg max-w-xl mx-auto">
                Get a free, expert valuation in 24 hours. No commitment, no pressure — just an honest market price.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-white/50 text-sm">Properties valued</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">24h</p>
                  <p className="text-white/50 text-sm">Response time</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-white/50 text-sm">Accuracy rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">{b.title}</p>
                  <p className="text-[#6B6B6B] text-sm mt-1">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Details */}
                <Reveal>
                  <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#B8926A]/10 flex items-center justify-center text-sm">1</span>
                      Property Details
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Type & Location */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Property Type *
                          </label>
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">Select type</option>
                            {propertyTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Location *
                          </label>
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">Select location</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Street Address <span className="text-[#6B6B6B] font-normal">(optional, helps accuracy)</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="e.g. 12 Rue de la Gare"
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                        />
                      </div>

                      {/* Size & Rooms */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Size (m²) *
                          </label>
                          <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 120"
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Bedrooms *
                          </label>
                          <select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">Select</option>
                            {[0, 1, 2, 3, 4, 5, "6+"].map((n) => (
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
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, "5+"].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Condition */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Condition *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">Select condition</option>
                          {conditions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Floor & Parking */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Floor <span className="text-[#6B6B6B] font-normal">(for apartments)</span>
                          </label>
                          <input
                            type="text"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="e.g. 3rd of 5"
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Parking
                          </label>
                          <select
                            name="parking"
                            value={formData.parking}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">Select</option>
                            <option value="none">None</option>
                            <option value="1 indoor">1 indoor spot</option>
                            <option value="2 indoor">2 indoor spots</option>
                            <option value="outdoor">Outdoor only</option>
                            <option value="garage">Private garage</option>
                          </select>
                        </div>
                      </div>

                      {/* Outdoor */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Outdoor Space
                        </label>
                        <select
                          name="outdoor"
                          value={formData.outdoor}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">Select</option>
                          <option value="none">None</option>
                          <option value="balcony">Balcony</option>
                          <option value="terrace">Terrace</option>
                          <option value="garden">Garden</option>
                          <option value="terrace+garden">Terrace + Garden</option>
                        </select>
                      </div>

                      {/* Additional Info */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Anything else we should know?
                        </label>
                        <textarea
                          name="extras"
                          value={formData.extras}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Recent renovations, special features, reason for selling..."
                          className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none placeholder:text-[#999]"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Photo Upload */}
                <Reveal delay={0.1}>
                  <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#B8926A]/10 flex items-center justify-center text-sm">2</span>
                      Photos
                      <span className="text-[#6B6B6B] font-normal text-sm ml-1">(optional but helps accuracy)</span>
                    </h2>
                    <p className="text-[#6B6B6B] text-sm mb-6">
                      Upload up to 10 photos of your property — interior, exterior, views.
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
                        Drag & drop photos here
                      </p>
                      <p className="text-[#6B6B6B] text-sm mt-1">
                        or <span className="text-[#B8926A]">browse</span> to upload
                      </p>
                      <p className="text-[#999] text-xs mt-2">
                        JPG, PNG up to 10MB each · Max 10 photos
                      </p>
                    </div>

                    {/* Photo Previews */}
                    {photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F5F3EF]">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(index)
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>

                {/* Contact Details */}
                <Reveal delay={0.2}>
                  <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#B8926A]/10 flex items-center justify-center text-sm">3</span>
                      Your Contact Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+352 621 123 456"
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          When are you looking to sell?
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">As soon as possible</option>
                          <option value="1-3 months">Within 1-3 months</option>
                          <option value="3-6 months">Within 3-6 months</option>
                          <option value="6+ months">6+ months</option>
                          <option value="just curious">Just curious about the value</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Submit */}
                <Reveal delay={0.3}>
                  <div className="text-center">
                    <Button
                      type="submit"
                      className="h-14 px-10 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white text-lg w-full sm:w-auto"
                    >
                      Get My Free Valuation
                    </Button>
                    <p className="text-[#6B6B6B] text-sm mt-4">
                      We&apos;ll contact you within 24 hours · No commitment required
                    </p>
                  </div>
                </Reveal>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Testimonials */}
                <Reveal>
                  <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
                    <h3 className="font-semibold text-[#1A1A1A] mb-4">What our clients say</h3>
                    <div className="space-y-4">
                      {testimonials.map((t, i) => (
                        <div key={i} className="pb-4 border-b border-[#E8E6E3] last:border-0 last:pb-0">
                          <p className="text-[#6B6B6B] text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                          <p className="text-[#1A1A1A] text-sm font-medium mt-2">{t.name}</p>
                          <p className="text-[#999] text-xs">{t.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Trust Signals */}
                <Reveal delay={0.1}>
                  <div className="bg-[#0F0F10] rounded-2xl p-6 text-white">
                    <h3 className="font-semibold mb-4">Why get a valuation?</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <svg className="w-5 h-5 text-[#B8926A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Know if now is the right time to sell</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="w-5 h-5 text-[#B8926A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Understand your property&apos;s market position</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="w-5 h-5 text-[#B8926A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Get tips to increase your property&apos;s value</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="w-5 h-5 text-[#B8926A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Plan your next move with confidence</span>
                      </li>
                    </ul>
                  </div>
                </Reveal>

                {/* Contact Card */}
                <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">Prefer to talk?</h3>
                    <p className="text-[#6B6B6B] text-sm mb-4">
                    Call us directly for immediate assistance.
                    </p>

                    <a
                    href="tel:+35226262626"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F3EF] hover:bg-[#E8E6E3] transition-colors"
                    >
                    <div className="w-10 h-10 rounded-full bg-[#B8926A]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[#1A1A1A] font-medium">+352 26 26 26 26</p>
                        <p className="text-[#6B6B6B] text-xs">Mon-Fri 9:00-18:00</p>
                    </div>
                    </a>
                </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}