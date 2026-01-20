"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  propertyId: string
  className?: string
  size?: "sm" | "md"
  variant?: "icon" | "full"
  label?: string
}

const FavoriteButton = memo(function FavoriteButton({
  propertyId,
  className = "",
  size = "md",
  variant = "icon",
  label,
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/favorites?propertyId=${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error("Failed to check favorite status:", error)
    }
  }, [propertyId])

  useEffect(() => {
    if (session?.user) {
      checkFavoriteStatus()
    }
  }, [session, checkFavoriteStatus])

  const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    } finally {
      setLoading(false)
    }
  }, [session, router, isFavorite, propertyId])

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"

  // Full button variant (with text)
  if (variant === "full") {
    return (
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${className}`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`${iconSize} transition-colors ${isFavorite ? "text-red-500 fill-red-500" : "text-[#6B6B6B]"}`}
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {label && <span>{isFavorite ? "Saved" : label}</span>}
      </button>
    )
  }

  // Icon-only variant (default)
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-9 h-9"

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses} bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`${iconSize} transition-colors ${isFavorite ? "text-red-500 fill-red-500" : "text-[#6B6B6B]"}`}
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
})

export { FavoriteButton }
export default FavoriteButton
