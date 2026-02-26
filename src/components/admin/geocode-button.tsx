"use client"

import { useState } from "react"

export default function GeocodeButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleGeocode = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/admin/properties/geocode-all", {
        method: "POST",
      })
      const data = await res.json()

      if (res.ok) {
        setResult(`${data.message}`)
      } else {
        setResult(data.error || "Failed to geocode")
      }
    } catch {
      setResult("Network error — please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleGeocode}
        disabled={loading}
        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:shadow-md transition-shadow w-full text-left disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          {loading ? (
            <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium text-[#1A1A1A]">
            {loading ? "Geocoding..." : "Geocode Properties"}
          </p>
          <p className="text-xs text-[#6B6B6B]">
            {result || "Add map coordinates to all properties"}
          </p>
        </div>
      </button>
    </div>
  )
}
