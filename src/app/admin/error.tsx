"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Admin Error</h2>
        <p className="text-[#6B6B6B] mb-6">
          Something went wrong. Please try again or return to the admin panel.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl px-6"
          >
            Try again
          </Button>
          <Link href="/admin">
            <Button variant="outline" className="rounded-xl border-[#E8E6E3] px-6">
              Back to Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
