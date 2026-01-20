"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createPortal } from "react-dom"

interface Property {
  id: string
  status: string
  slug: string
  isFeatured: boolean
}

export function PropertyActions({ property }: { property: Property }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 192 // w-48 = 12rem = 192px

      // Calculate position - align to right of button
      let left = rect.right - menuWidth
      const top = rect.bottom + 8 // 8px gap

      // Ensure menu doesn't go off-screen to the left
      if (left < 8) {
        left = 8
      }

      setMenuPosition({ top, left })
    }
  }, [menuOpen])

  const updateStatus = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${property.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  const toggleFeatured = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${property.id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !property.isFeatured }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  const deleteProperty = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete property:", error)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  const menuContent = menuOpen && mounted ? createPortal(
    <>
      <div className="fixed inset-0 z-[100]" onClick={() => setMenuOpen(false)} />
      <div
        className="fixed w-48 bg-white rounded-xl shadow-xl border border-[#E8E6E3] py-1 z-[101]"
        style={{ top: menuPosition.top, left: menuPosition.left }}
      >
        <Link
          href={`/admin/properties/${property.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>

        <Link
          href={`/properties/${property.slug}`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </Link>

        <div className="border-t border-[#E8E6E3] my-1" />

        {/* Featured Toggle */}
        <button
          onClick={toggleFeatured}
          className={`flex items-center gap-2 px-4 py-2 text-sm w-full ${
            property.isFeatured
              ? "text-amber-600 hover:bg-amber-50"
              : "text-[#B8926A] hover:bg-[#B8926A]/10"
          }`}
        >
          <svg className="w-4 h-4" fill={property.isFeatured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          {property.isFeatured ? "Remove Featured" : "Mark as Featured"}
        </button>

        <div className="border-t border-[#E8E6E3] my-1" />

        {property.status === "PENDING_REVIEW" && (
          <>
            <button
              onClick={() => updateStatus("PUBLISHED")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => updateStatus("REJECTED")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </>
        )}

        {property.status === "PUBLISHED" && (
          <button
            onClick={() => updateStatus("ARCHIVED")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6B6B] hover:bg-[#F5F3EF] w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive
          </button>
        )}

        {property.status === "DRAFT" && (
          <button
            onClick={() => updateStatus("PENDING_REVIEW")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Submit for Review
          </button>
        )}

        <div className="border-t border-[#E8E6E3] my-1" />

        <button
          onClick={deleteProperty}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </>,
    document.body
  ) : null

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={loading}
        className="p-2 hover:bg-[#F5F3EF] rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-[#6B6B6B]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        )}
      </button>
      {menuContent}
    </div>
  )
}
