"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { LazyMotion, domAnimation, m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/components/favorite-button"
import { useI18n } from "@/lib/i18n"

interface Translations {
  en?: string
  fr?: string
  de?: string
  [key: string]: string | undefined
}

interface Property {
  id: string
  title: string
  slug: string
  description: string
  titleTranslations?: Translations | null
  descriptionTranslations?: Translations | null
  location: string
  address: string
  price: number
  type: string
  listingType: string
  beds: number
  baths: number
  area: number
  landArea?: number
  yearBuilt?: number
  energyClass?: string
  floor?: number
  totalFloors?: number
  features: string[]
  images: string[]
  agent: {
    name: string
    phone: string
    email: string
    image: string
    agency: string
  }
}

interface SimilarProperty {
  id: string
  title: string
  slug: string
  location: string
  price: number
  type: string
  listingType: string
  beds: number
  baths: number
  area: number
  image: string
}

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default function PropertyDetailPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const slug = params.slug as string

  // Helper to get translated content
  const getTranslated = (defaultValue: string, translations?: Translations | null): string => {
    if (!translations || typeof translations !== 'object') return defaultValue
    const localeValue = translations[locale]
    if (localeValue && localeValue.trim()) return localeValue
    const enValue = translations.en
    if (enValue && enValue.trim()) return enValue
    return defaultValue
  }

  const [property, setProperty] = useState<Property | null>(null)
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeImage, setActiveImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // Gallery navigation - memoized handlers (must be before any early returns)
  const openGallery = useCallback((index: number) => {
    setGalleryIndex(index)
    setShowGallery(true)
  }, [])

  const nextImage = useCallback(() => {
    setGalleryIndex((prev) => (prev + 1) % (property?.images?.length || 1))
  }, [property?.images?.length])

  const prevImage = useCallback(() => {
    setGalleryIndex((prev) => (prev - 1 + (property?.images?.length || 1)) % (property?.images?.length || 1))
  }, [property?.images?.length])

  const closeGallery = useCallback(() => {
    setShowGallery(false)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage()
    else if (e.key === "ArrowLeft") prevImage()
    else if (e.key === "Escape") closeGallery()
  }, [nextImage, prevImage, closeGallery])

  // Memoize price per sqm calculation
  const pricePerSqm = useMemo(() => {
    if (!property?.area) return null
    return Math.round(property.price / property.area)
  }, [property?.price, property?.area])

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${slug}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Property not found")
          return
        }

        setProperty(data.property)
        setSimilarProperties(data.similarProperties)
        setContactForm((prev) => ({
          ...prev,
          message: `Hi, I'm interested in this property: ${data.property.title}`,
        }))
      } catch (err) {
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8926A]"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-4">{t.propertyDetail.notFound}</h1>
          <p className="text-[#6B6B6B] mb-6">{error || t.propertyDetail.notFoundDesc}</p>
          <Button asChild className="rounded-xl bg-[#1A1A1A]">
            <Link href="/properties">{t.properties.backToProperties}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* Full Screen Gallery Modal - Mobile Optimized */}
      {showGallery && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-full text-white text-xs md:text-sm">
            {galleryIndex + 1} / {property.images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Image - Mobile optimized spacing */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 md:p-0"
            style={{ top: '50px', bottom: '80px', left: '0', right: '0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full md:mx-20">
              <Image
                src={property.images[galleryIndex]}
                alt={`Property image ${galleryIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail Strip - Hidden on mobile for more image space */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex gap-2 max-w-[90vw] overflow-x-auto py-2 px-4">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setGalleryIndex(index); }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  galleryIndex === index ? "ring-2 ring-[#B8926A] opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={image} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Mobile dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex md:hidden gap-1.5">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setGalleryIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  galleryIndex === index ? "bg-[#B8926A] w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery - Mobile Optimized */}
      <section className="pt-16 bg-[#1A1A1A]">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 h-[300px] md:h-[500px]">
            {/* Main Image */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => openGallery(activeImage)}
              className="relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div className="relative w-full h-full">
                <Image
                  src={property.images[activeImage] || property.images[0]}
                  alt={getTranslated(property.title, property.titleTranslations)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-[#1A1A1A]">
                  Click to view gallery
                </span>
              </div>
            </m.div>

            {/* Thumbnails - Hidden on small mobile, shown on tablet+ */}
            <div className="hidden md:grid grid-cols-2 gap-2 md:gap-4">
              {property.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  onClick={() => index === 3 && property.images.length > 4 ? openGallery(3) : setActiveImage(index)}
                  className={`relative rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all ${
                    activeImage === index ? "ring-2 ring-[#B8926A]" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  {index === 3 && property.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white font-semibold">+{property.images.length - 4} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Image Counter / Gallery Link */}
          <div className="md:hidden mt-3 flex items-center justify-between">
            <span className="text-white/70 text-sm">{property.images.length} photos</span>
            <button
              onClick={() => openGallery(0)}
              className="text-[#B8926A] text-sm font-medium flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.listingType === "RENT" ? "bg-blue-500 text-white" : "bg-[#B8926A] text-white"
                        }`}
                      >
                        {property.listingType === "RENT" ? t.properties.forRent : t.properties.forSale}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F3EF] text-[#6B6B6B]">
                        {t.common.propertyTypes?.[property.type as keyof typeof t.common.propertyTypes] || property.type}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">
                      {getTranslated(property.title, property.titleTranslations)}
                    </h1>

                    <p className="text-[#6B6B6B] mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {property.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      €{formatNumber(property.price)}
                      {property.listingType === "RENT" && (
                        <span className="text-lg font-normal text-[#6B6B6B]">{t.common.perMonth}</span>
                      )}
                    </p>

                    {pricePerSqm && (
                      <p className="text-[#6B6B6B] text-sm mt-1">
                        €{formatNumber(pricePerSqm)}/m²
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E8E6E3]">
                  {property.beds > 0 && (
                    <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                      <p className="text-2xl font-semibold text-[#1A1A1A]">{property.beds}</p>
                      <p className="text-sm text-[#6B6B6B]">{t.propertyDetail.bedrooms}</p>
                    </div>
                  )}
                  <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                    <p className="text-2xl font-semibold text-[#1A1A1A]">{property.baths}</p>
                    <p className="text-sm text-[#6B6B6B]">{t.propertyDetail.bathrooms}</p>
                  </div>
                  <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                    <p className="text-2xl font-semibold text-[#1A1A1A]">{property.area}</p>
                    <p className="text-sm text-[#6B6B6B]">{t.propertyDetail.livingArea}</p>
                  </div>
                  {property.landArea && (
                    <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                      <p className="text-2xl font-semibold text-[#1A1A1A]">{property.landArea}</p>
                      <p className="text-sm text-[#6B6B6B]">{t.propertyDetail.landArea}</p>
                    </div>
                  )}
                </div>
              </m.div>

              {/* Description */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t.propertyDetail.description}</h2>
                <div className="text-[#6B6B6B] whitespace-pre-line leading-relaxed">
                  {getTranslated(property.description, property.descriptionTranslations)}
                </div>
              </m.div>

              {/* Features */}
              {property.features.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t.propertyDetail.features}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-[#6B6B6B]">
                        <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t.common.features?.[feature as keyof typeof t.common.features] || feature}
                      </div>
                    ))}
                  </div>
                </m.div>
              )}

              {/* Details */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t.propertyDetail.details}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                    <span className="text-[#6B6B6B]">{t.propertyDetail.propertyType}</span>
                    <span className="font-medium text-[#1A1A1A]">{t.common.propertyTypes?.[property.type as keyof typeof t.common.propertyTypes] || property.type}</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                      <span className="text-[#6B6B6B]">{t.propertyDetail.yearBuilt}</span>
                      <span className="font-medium text-[#1A1A1A]">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.energyClass && (
                    <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                      <span className="text-[#6B6B6B]">{t.propertyDetail.energyClass}</span>
                      <span
                        className={`font-medium px-2 py-0.5 rounded ${
                          property.energyClass === "A" || property.energyClass === "B"
                            ? "bg-green-100 text-green-700"
                            : property.energyClass === "C" || property.energyClass === "D"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {property.energyClass}
                      </span>
                    </div>
                  )}
                  {property.floor !== undefined && property.totalFloors !== undefined && (
                    <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                      <span className="text-[#6B6B6B]">{t.propertyDetail.floor}</span>
                      <span className="font-medium text-[#1A1A1A]">
                        {property.floor} / {property.totalFloors}
                      </span>
                    </div>
                  )}
                </div>
              </m.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Agent Card */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${property.agent.image}')` }}
                    />
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{property.agent.name}</p>
                      <p className="text-sm text-[#6B6B6B]">{property.agent.agency}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-3 text-[#6B6B6B] hover:text-[#B8926A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {property.agent.phone}
                    </a>

                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-3 text-[#6B6B6B] hover:text-[#B8926A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {property.agent.email}
                    </a>
                  </div>

                  <Button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl"
                  >
                    {t.propertyDetail.contactAgent}
                  </Button>
                </m.div>

                {/* Contact Form */}
                {showContact && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h3 className="font-semibold text-[#1A1A1A] mb-4">{t.propertyDetail.sendMessage}</h3>
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder={t.propertyDetail.yourName}
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <input
                        type="email"
                        placeholder={t.propertyDetail.yourEmail}
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <input
                        type="tel"
                        placeholder={t.propertyDetail.yourPhone}
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <textarea
                        placeholder={t.propertyDetail.yourMessage}
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] resize-none"
                      />
                      <Button className="w-full h-12 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl">
                        {t.propertyDetail.send}
                      </Button>
                    </form>
                  </m.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <FavoriteButton
                    propertyId={property.id}
                    variant="full"
                    label={t.common.save}
                    className="flex-1 h-11 rounded-xl border border-[#E8E6E3] bg-white hover:bg-[#F5F3EF]"
                    size="md"
                  />

                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl border-[#E8E6E3]"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          url: window.location.href,
                        })
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        setToastMessage(t.common.linkCopied || "Link copied to clipboard!")
                        setShowToast(true)
                        setTimeout(() => setShowToast(false), 3000)
                      }
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    {t.common.share}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-8">{t.propertyDetail.similarProperties}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E6E3]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${p.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-xl font-bold text-white">
                        €{formatNumber(p.price)}
                        {p.listingType === "RENT" && <span className="text-sm font-normal opacity-80">/mo</span>}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8926A] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#6B6B6B] mt-1">{p.location}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[#6B6B6B]">
                      {p.beds > 0 && <span>{p.beds} {t.common.beds}</span>}
                      <span>{p.baths} {t.common.baths}</span>
                      <span>{p.area} m²</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="/properties">
          <Button variant="outline" className="h-12 px-6 rounded-xl bg-white shadow-lg border-[#E8E6E3]">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.properties.backToProperties}
          </Button>
        </Link>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}
    </LazyMotion>
  )
}
