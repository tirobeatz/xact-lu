"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/components/favorite-button"
import { locations } from "@/lib/locations"
import { useI18n } from "@/lib/i18n"

interface Property {
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
  tag: string
}

const propertyTypes = ["All", "Apartment", "House", "Villa", "Penthouse", "Studio", "Duplex", "Office"]

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function PropertiesContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()

  // Get URL params
  const typeParam = searchParams.get("type")
  const locationParam = searchParams.get("location")
  const minBedsParam = searchParams.get("minBeds")
  const maxPriceParam = searchParams.get("maxPrice")
  const propertyTypeParam = searchParams.get("propertyType")
  const minAreaParam = searchParams.get("minArea")

  // Filter states
  const [listingType, setListingType] = useState<"ALL" | "SALE" | "RENT">("ALL")
  const [propertyType, setPropertyType] = useState("All")
  const [location, setLocation] = useState("All")
  const [maxPrice, setMaxPrice] = useState(5000000)
  const [minBeds, setMinBeds] = useState(0)
  const [minArea, setMinArea] = useState(0)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Data states
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Apply URL params on load
  useEffect(() => {
    if (typeParam === "SALE" || typeParam === "RENT") {
      setListingType(typeParam)
    }
    if (locationParam) {
      setLocation(locationParam)
    }
    if (minBedsParam) {
      setMinBeds(Number(minBedsParam))
    }
    if (maxPriceParam) {
      setMaxPrice(Number(maxPriceParam))
    }
    if (propertyTypeParam) {
      setPropertyType(propertyTypeParam)
    }
    if (minAreaParam) {
      setMinArea(Number(minAreaParam))
    }
  }, [typeParam, locationParam, minBedsParam, maxPriceParam, propertyTypeParam, minAreaParam])

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (listingType !== "ALL") params.set("listingType", listingType)
      if (propertyType !== "All") params.set("propertyType", propertyType)
      if (location !== "All") params.set("location", location)
      if (minBeds > 0) params.set("minBeds", minBeds.toString())
      if (maxPrice < 5000000) params.set("maxPrice", maxPrice.toString())
      if (minArea > 0) params.set("minArea", minArea.toString())
      params.set("sortBy", sortBy)
      params.set("page", page.toString())
      params.set("limit", "12")

      const res = await fetch(`/api/properties?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setProperties(data.properties)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error)
    } finally {
      setLoading(false)
    }
  }, [listingType, propertyType, location, minBeds, maxPrice, minArea, sortBy, page])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // Reset all filters
  const resetFilters = () => {
    setListingType("ALL")
    setPropertyType("All")
    setLocation("All")
    setMaxPrice(5000000)
    setMinBeds(0)
    setMinArea(0)
    setSortBy("newest")
    setPage(1)
  }

  // Count active filters
  const activeFilters = [
    listingType !== "ALL",
    propertyType !== "All",
    location !== "All",
    maxPrice < 5000000,
    minBeds > 0,
    minArea > 0,
  ].filter(Boolean).length

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8926A]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              {t.properties.title}
            </h1>
            <p className="text-white/60 mt-3 text-lg">
              {total} {t.properties.available}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-2xl p-4 shadow-2xl"
          >
            {/* Main Filters Row */}
            <div className="flex flex-wrap gap-3">
              {/* Listing Type Tabs */}
              <div className="flex bg-[#F5F3EF] rounded-xl p-1">
                {[
                  { key: "ALL", label: t.search.all },
                  { key: "SALE", label: t.search.buy },
                  { key: "RENT", label: t.search.rent },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => { setListingType(type.key as "ALL" | "SALE" | "RENT"); setPage(1) }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      listingType === type.key
                        ? "bg-[#1A1A1A] text-white shadow-md"
                        : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Location */}
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1) }}
                className="flex-1 min-w-[180px] h-11 px-4 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "All" ? t.search.allLocations : loc}
                  </option>
                ))}
              </select>

              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => { setPropertyType(e.target.value); setPage(1) }}
                className="h-11 px-4 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer"
              >
                <option value="All">{t.search.allTypes}</option>
                {propertyTypes.slice(1).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* More Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-11 px-5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  showFilters || activeFilters > 0
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-[#F5F3EF] text-[#1A1A1A] hover:bg-[#E8E6E3]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {t.search.filters}
                {activeFilters > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#B8926A] text-white text-xs flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t border-[#E8E6E3]"
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Min Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.search.bedrooms}
                    </label>
                    <select
                      value={minBeds}
                      onChange={(e) => { setMinBeds(Number(e.target.value)); setPage(1) }}
                      className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none"
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+ {t.common.beds}</option>
                      <option value={2}>2+ {t.common.beds}</option>
                      <option value={3}>3+ {t.common.beds}</option>
                      <option value={4}>4+ {t.common.beds}</option>
                      <option value={5}>5+ {t.common.beds}</option>
                    </select>
                  </div>

                  {/* Min Area */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.search.minArea}
                    </label>
                    <select
                      value={minArea}
                      onChange={(e) => { setMinArea(Number(e.target.value)); setPage(1) }}
                      className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none"
                    >
                      <option value={0}>Any</option>
                      <option value={50}>50+ m²</option>
                      <option value={75}>75+ m²</option>
                      <option value={100}>100+ m²</option>
                      <option value={150}>150+ m²</option>
                      <option value={200}>200+ m²</option>
                      <option value={300}>300+ m²</option>
                    </select>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.search.maxPrice}: €{formatNumber(maxPrice)}
                    </label>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                      className="w-full h-2 bg-[#E8E6E3] rounded-full appearance-none cursor-pointer mt-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.search.sortBy}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none"
                    >
                      <option value="newest">{t.search.newest}</option>
                      <option value="price-low">{t.search.priceLow}</option>
                      <option value="price-high">{t.search.priceHigh}</option>
                      <option value="area-high">{t.search.areaHigh}</option>
                      <option value="beds-high">{t.search.bedsHigh}</option>
                    </select>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="h-10 px-6 rounded-xl border-[#E8E6E3]"
                    onClick={resetFilters}
                  >
                    {t.search.resetFilters}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#6B6B6B]">
              {t.properties.showing} <span className="font-semibold text-[#1A1A1A]">{properties.length}</span> {t.properties.of} {total}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-4 rounded-lg border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none md:hidden"
            >
              <option value="newest">{t.search.newest}</option>
              <option value="price-low">{t.search.priceLow}</option>
              <option value="price-high">{t.search.priceHigh}</option>
            </select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-4 pt-4 border-t border-[#E8E6E3]">
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E6E3] p-16 text-center">
              <div className="w-16 h-16 bg-[#F5F3EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{t.properties.noProperties}</h3>
              <p className="text-[#6B6B6B] mb-6">{t.properties.noPropertiesDesc}</p>
              <Button
                onClick={resetFilters}
                className="rounded-xl bg-[#1A1A1A]"
              >
                {t.properties.clearFilters}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/properties/${property.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${property.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          property.listingType === "RENT"
                            ? "bg-blue-500 text-white"
                            : "bg-[#B8926A] text-white"
                        }`}>
                          {property.listingType === "RENT" ? t.properties.forRent : t.properties.forSale}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <FavoriteButton
                        propertyId={property.id}
                        className="absolute top-4 right-4"
                      />

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-bold text-white">
                          €{formatNumber(property.price)}
                          {property.listingType === "RENT" && (
                            <span className="text-sm font-normal opacity-80">/mo</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8926A] transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-[#6B6B6B] mt-1 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-[#F5F3EF] rounded-md text-xs text-[#6B6B6B]">
                          {property.tag}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E6E3]">
                        {property.beds > 0 && (
                          <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {property.beds} {property.beds === 1 ? t.common.bed : t.common.beds}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          {property.baths} {property.baths === 1 ? t.common.bath : t.common.baths}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {property.area} m²
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="text-center mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-[#E8E6E3] hover:bg-[#F5F3EF]"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                {t.common.previous}
              </Button>
              <span className="text-[#6B6B6B]">
                {t.properties.page} {page} {t.properties.of} {totalPages}
              </span>
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-[#E8E6E3] hover:bg-[#F5F3EF]"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t.common.next}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// Loading fallback
function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8926A]"></div>
    </div>
  )
}

// Main export with Suspense wrapper
export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesLoading />}>
      <PropertiesContent />
    </Suspense>
  )
}
