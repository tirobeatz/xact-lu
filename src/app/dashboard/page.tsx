"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-[#6B6B6B]">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
              <span className="text-lg font-bold text-white">X</span>
            </div>
            <span className="text-lg font-semibold text-[#1A1A1A]">Xact</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B6B6B]">
              {session.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Welcome, {session.user?.name || "User"}!
        </h1>
        <p className="text-[#6B6B6B] mb-8">
          Manage your properties and account settings.
        </p>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Listings */}
          <Link href="/dashboard/listings" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">My Listings</h3>
            <p className="text-sm text-[#6B6B6B]">View and manage your properties</p>
          </Link>

          {/* Add New Listing */}
          <Link href="/dashboard/listings/new" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Add New Listing</h3>
            <p className="text-sm text-[#6B6B6B]">Submit a new property</p>
          </Link>

          {/* Saved Properties */}
          <Link href="/dashboard/saved" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Saved Properties</h3>
            <p className="text-sm text-[#6B6B6B]">Properties you&apos;ve favorited</p>
          </Link>

          {/* Messages */}
          <Link href="/dashboard/messages" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Messages</h3>
            <p className="text-sm text-[#6B6B6B]">View inquiries and messages</p>
          </Link>

          {/* Profile Settings */}
          <Link href="/dashboard/profile" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Profile</h3>
            <p className="text-sm text-[#6B6B6B]">Update your account settings</p>
          </Link>

          {/* Billing */}
          <Link href="/dashboard/billing" className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:border-[#B8926A] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Billing</h3>
            <p className="text-sm text-[#6B6B6B]">Manage your subscription</p>
          </Link>
        </div>
      </div>
    </div>
  )
}