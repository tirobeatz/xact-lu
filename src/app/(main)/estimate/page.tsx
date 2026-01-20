"use client"

import { useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { locations } from "@/lib/locations"
import { useI18n } from "@/lib/i18n"

const propertyTypes = ["Apartment", "House", "Villa", "Penthouse", "Studio", "Duplex", "Land", "Commercial"]

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
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const benefits = [
    { icon: "📈", title: t.estimate.benefits.trueValue.title, desc: t.estimate.benefits.trueValue.desc },
    { icon: "⏱️", title: t.estimate.benefits.expertResponse.title, desc: t.estimate.benefits.expertResponse.desc },
    { icon: "🔒", title: t.estimate.benefits.confidential.title, desc: t.estimate.benefits.confidential.desc },
    { icon: "🆓", title: t.estimate.benefits.free.title, desc: t.estimate.benefits.free.desc },
  ]

  const conditions = [
    t.estimate.conditions.newRenovated,
    t.estimate.conditions.goodCondition,
    t.estimate.conditions.lightRefresh,
    t.estimate.conditions.fullRenovation,
  ]

  const parkingOptions = [
    { value: "none", label: t.estimate.form.parkingOptions.none },
    { value: "1 indoor", label: t.estimate.form.parkingOptions.indoor1 },
    { value: "2 indoor", label: t.estimate.form.parkingOptions.indoor2 },
    { value: "outdoor", label: t.estimate.form.parkingOptions.outdoor },
    { value: "garage", label: t.estimate.form.parkingOptions.garage },
  ]

  const outdoorOptions = [
    { value: "none", label: t.estimate.form.outdoorOptions.none },
    { value: "balcony", label: t.estimate.form.outdoorOptions.balcony },
    { value: "terrace", label: t.estimate.form.outdoorOptions.terrace },
    { value: "garden", label: t.estimate.form.outdoorOptions.garden },
    { value: "terrace+garden", label: t.estimate.form.outdoorOptions.terraceGarden },
  ]

  const timelineOptions = [
    { value: "asap", label: t.estimate.form.timelineOptions.asap },
    { value: "1-3 months", label: t.estimate.form.timelineOptions["1to3"] },
    { value: "3-6 months", label: t.estimate.form.timelineOptions["3to6"] },
    { value: "6+ months", label: t.estimate.form.timelineOptions["6plus"] },
    { value: "just curious", label: t.estimate.form.timelineOptions.curious },
  ]

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
            {t.estimate.success.title}
          </h1>
          <p className="text-[#6B6B6B] mt-4 max-w-md mx-auto">
            {t.estimate.success.description}
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setPhotos([])
            }}
            variant="outline"
            className="mt-8 h-11 px-6 rounded-xl border-[#E8E6E3]"
          >
            {t.estimate.success.submitAnother}
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
                {t.estimate.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-6 leading-tight">
                {t.estimate.heroTitle}
                <span className="block text-[#B8926A]">{t.estimate.heroHighlight}</span>
              </h1>

              <p className="text-white/60 mt-6 text-lg max-w-xl mx-auto">
                {t.estimate.heroSubtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-white/50 text-sm">{t.estimate.stats.propertiesValued}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">24h</p>
                  <p className="text-white/50 text-sm">{t.estimate.stats.responseTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-white/50 text-sm">{t.estimate.stats.accuracyRate}</p>
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
                      {t.estimate.form.propertyDetails}
                    </h2>

                    <div className="space-y-4">
                      {/* Type & Location */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            {t.estimate.form.propertyType} *
                          </label>
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">{t.estimate.form.selectType}</option>
                            {propertyTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            {t.estimate.form.location} *
                          </label>
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">{t.estimate.form.selectLocation}</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.estimate.form.streetAddress} <span className="text-[#6B6B6B] font-normal">{t.estimate.form.streetAddressHint}</span>
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
                            {t.estimate.form.size} *
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
                            {t.estimate.form.bedrooms} *
                          </label>
                          <select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">{t.estimate.form.select}</option>
                            {[0, 1, 2, 3, 4, 5, "6+"].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            {t.estimate.form.bathrooms}
                          </label>
                          <select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">{t.estimate.form.select}</option>
                            {[1, 2, 3, 4, "5+"].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Condition */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.estimate.form.condition} *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">{t.estimate.form.selectCondition}</option>
                          {conditions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Floor & Parking */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            {t.estimate.form.floor} <span className="text-[#6B6B6B] font-normal">{t.estimate.form.floorHint}</span>
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
                            {t.estimate.form.parking}
                          </label>
                          <select
                            name="parking"
                            value={formData.parking}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                          >
                            <option value="">{t.estimate.form.select}</option>
                            {parkingOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Outdoor */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.estimate.form.outdoorSpace}
                        </label>
                        <select
                          name="outdoor"
                          value={formData.outdoor}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">{t.estimate.form.select}</option>
                          {outdoorOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Additional Info */}
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.estimate.form.anythingElse}
                        </label>
                        <textarea
                          name="extras"
                          value={formData.extras}
                          onChange={handleChange}
                          rows={3}
                          placeholder={t.estimate.form.anythingElsePlaceholder}
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
                      {t.estimate.form.photos}
                      <span className="text-[#6B6B6B] font-normal text-sm ml-1">{t.estimate.form.photosHint}</span>
                    </h2>
                    <p className="text-[#6B6B6B] text-sm mb-6">
                      {t.estimate.form.photosDescription}
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
                        {t.estimate.form.dragDrop}
                      </p>
                      <p className="text-[#6B6B6B] text-sm mt-1">
                        or <span className="text-[#B8926A]">{t.estimate.form.browse}</span> {t.estimate.form.toUpload}
                      </p>
                      <p className="text-[#999] text-xs mt-2">
                        {t.estimate.form.photoLimits}
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
                      {t.estimate.form.contactDetails}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          {t.estimate.form.fullName} *
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
                            {t.estimate.form.email} *
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
                            {t.estimate.form.phone} *
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
                          {t.estimate.form.timeline}
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                        >
                          <option value="">{t.estimate.form.selectTimeline}</option>
                          {timelineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
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
                      {t.estimate.form.submit}
                    </Button>
                    <p className="text-[#6B6B6B] text-sm mt-4">
                      {t.estimate.form.submitNote}
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
                    <h3 className="font-semibold text-[#1A1A1A] mb-4">{t.estimate.sidebar.clientsSay}</h3>
                    <div className="space-y-4">
                      {testimonials.map((testimonial, i) => (
                        <div key={i} className="pb-4 border-b border-[#E8E6E3] last:border-0 last:pb-0">
                          <p className="text-[#6B6B6B] text-sm italic">&ldquo;{testimonial.quote}&rdquo;</p>
                          <p className="text-[#1A1A1A] text-sm font-medium mt-2">{testimonial.name}</p>
                          <p className="text-[#999] text-xs">{testimonial.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Trust Signals */}
                <Reveal delay={0.1}>
                  <div className="bg-[#0F0F10] rounded-2xl p-6 text-white">
                    <h3 className="font-semibold mb-4">{t.estimate.sidebar.whyValuation}</h3>
                    <ul className="space-y-3 text-sm">
                      {t.estimate.sidebar.whyPoints.map((point, i) => (
                        <li key={i} className="flex gap-3">
                          <svg className="w-5 h-5 text-[#B8926A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/80">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                {/* Contact Card */}
                <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">{t.estimate.sidebar.preferToTalk}</h3>
                    <p className="text-[#6B6B6B] text-sm mb-4">
                    {t.estimate.sidebar.callDirectly}
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
