"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { motion } from "framer-motion"

interface Translations {
  en?: string
  fr?: string
  de?: string
  [key: string]: string | undefined
}

interface SavedProperty {
  id: string
  propertyId: string
  title: string
  titleTranslations?: Translations | null
  slug: string
  address: string
  price: number
  listingType: "SALE" | "RENT"
  bedrooms: number | null
  bathrooms: number | null
  livingArea: number | null
  image: string
  savedAt: string
}

export default function SavedPropertiesPage() {
  const { t, locale } = useI18n()

  // Helper to get translated text
  const getTranslated = (defaultValue: string, translations?: Translations | null): string => {
    if (!translations || typeof translations !== 'object') return defaultValue
    const localeValue = translations[locale]
    if (localeValue && localeValue.trim()) return localeValue
    const enValue = translations.en
    if (enValue && enValue.trim()) return enValue
    return defaultValue
  }
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<SavedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedProperties()
    }
  }, [status])

  const fetchSavedProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/favorites")
      if (!response.ok) throw new Error("Failed to fetch favorites")
      const data = await response.json()
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8926A]" />
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const handleRemove = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/user/favorites?id=${favoriteId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setProperties(prev => prev.filter(p => p.id !== favoriteId))
      }
    } catch (err) {
      console.error("Failed to remove favorite:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold text-white">
            {t.dashboard.saved?.title || "Saved Properties"}
          </h1>
          <p className="text-white/60 mt-1">
            {t.dashboard.saved?.subtitle || "Properties you've favorited"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <Link href={`/properties/${property.slug}`}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-[#1A1A1A] text-white">
                        {property.listingType === "SALE" ? t.properties?.forSale || "For Sale" : t.properties?.forRent || "For Rent"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(property.id)
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/properties/${property.slug}`}>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1 line-clamp-1 hover:text-[#B8926A] transition-colors">
                      {getTranslated(property.title, property.titleTranslations)}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#6B6B6B] mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-[#6B6B6B] mb-3">
                    {property.bedrooms !== null && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} {t.common?.beds || "beds"}
                      </span>
                    )}
                    {property.bathrooms !== null && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {property.bathrooms} {t.common?.baths || "baths"}
                      </span>
                    )}
                    {property.livingArea !== null && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.livingArea} m²
                      </span>
                    )}
                  </div>

                  <p className="text-lg font-bold text-[#B8926A]">
                    €{property.price.toLocaleString()}
                    {property.listingType === "RENT" && <span className="text-sm font-normal text-[#6B6B6B]">/mo</span>}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              {t.dashboard.saved?.noSaved || "No saved properties"}
            </h3>
            <p className="text-[#6B6B6B] mb-6">
              {t.dashboard.saved?.noSavedDesc || "Start browsing and save properties you like"}
            </p>
            <Link href="/properties">
              <Button className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                {t.dashboard.saved?.browseProperties || "Browse Properties"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
