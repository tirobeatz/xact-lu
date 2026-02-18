"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { motion } from "framer-motion"

interface Listing {
  id: string
  title: string
  slug: string
  address: string
  price: number
  listingType: "SALE" | "RENT"
  status: string
  bedrooms: number | null
  bathrooms: number | null
  livingArea: number | null
  image: string
  viewCount: number
  inquiryCount: number
  createdAt: string
}

export default function ListingsPage() {
  const { t } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "sold">("all")
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchListings()
    }
  }, [status, filter])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/listings?status=${filter}`)
      if (!response.ok) throw new Error("Failed to fetch listings")
      const data = await response.json()
      setListings(data)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-700"
      case "DRAFT":
      case "PENDING_REVIEW": return "bg-amber-100 text-amber-700"
      case "SOLD":
      case "RENTED": return "bg-blue-100 text-blue-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PUBLISHED": return t.dashboard.listings?.statusActive || "Active"
      case "DRAFT":
      case "PENDING_REVIEW": return t.dashboard.listings?.statusPending || "Pending Review"
      case "SOLD":
      case "RENTED": return t.dashboard.listings?.statusSold || "Sold"
      default: return status
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    try {
      const response = await fetch(`/api/user/listings/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setListings(listings.filter(l => l.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete listing:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                {t.dashboard.listings?.title || "My Listings"}
              </h1>
              <p className="text-white/60 mt-1">
                {t.dashboard.listings?.subtitle || "Manage your property listings"}
              </p>
            </div>
            <Link href="/dashboard/listings/new">
              <Button className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.dashboard.listings?.addNew || "Add New Listing"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: t.dashboard.listings?.filterAll || "All" },
            { key: "active", label: t.dashboard.listings?.filterActive || "Active" },
            { key: "pending", label: t.dashboard.listings?.filterPending || "Pending" },
            { key: "sold", label: t.dashboard.listings?.filterSold || "Sold" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white text-[#6B6B6B] hover:bg-[#F5F3EF] border border-[#E8E6E3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {getStatusText(listing.status)}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-[#1A1A1A] text-white">
                      {listing.listingType === "SALE" ? t.properties?.forSale || "For Sale" : t.properties?.forRent || "For Rent"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/properties/${listing.slug}`}>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1 line-clamp-1 hover:text-[#B8926A] transition-colors">
                      {listing.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#6B6B6B] mb-3">
                    {listing.address}
                  </p>
                  <p className="text-lg font-bold text-[#B8926A]">
                    €{listing.price.toLocaleString()}
                    {listing.listingType === "RENT" && <span className="text-sm font-normal text-[#6B6B6B]">/mo</span>}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E6E3]">
                    <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {listing.viewCount}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {listing.inquiryCount}
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                          <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              {t.dashboard.listings?.noListings || "No listings yet"}
            </h3>
            <p className="text-[#6B6B6B] mb-6">
              {t.dashboard.listings?.noListingsDesc || "Start by adding your first property listing"}
            </p>
            <Link href="/dashboard/listings/new">
              <Button className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                {t.dashboard.listings?.addNew || "Add New Listing"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
