"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Agency {
  id: string
  name: string
  slug: string
  isVerified: boolean
}

export function AgencyActions({ agency }: { agency: Agency }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleVerification = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/agencies/${agency.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !agency.isVerified }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update verification:", error)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  const deleteAgency = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${agency.name}"? This will also remove all associated properties and members.`
      )
    ) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/agencies/${agency.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete agency:", error)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={loading}
        className="p-2 hover:bg-[#F5F3EF] rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-[#6B6B6B]" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-[#6B6B6B]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        )}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E8E6E3] py-1 z-20">
            {/* View Agency */}
            <a
              href={`/agencies/${agency.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Profile
            </a>

            <div className="border-t border-[#E8E6E3] my-1" />

            {/* Verification Toggle */}
            <button
              onClick={toggleVerification}
              className={`flex items-center gap-2 px-4 py-2 text-sm w-full ${
                agency.isVerified
                  ? "text-amber-600 hover:bg-amber-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              {agency.isVerified ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Remove Verification
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verify Agency
                </>
              )}
            </button>

            <div className="border-t border-[#E8E6E3] my-1" />

            {/* Delete */}
            <button
              onClick={deleteAgency}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Agency
            </button>
          </div>
        </>
      )}
    </div>
  )
}
