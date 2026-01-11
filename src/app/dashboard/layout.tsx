import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/listings/new")
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-[#E8E6E3] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                <span className="text-lg font-bold text-white">X</span>
              </div>
              <span className="text-lg font-semibold text-[#1A1A1A]">Xact</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/listings" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                My Listings
              </Link>
              <Link href="/dashboard/favorites" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                Favorites
              </Link>
            </nav>

            {/* User */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/listings/new"
                className="hidden sm:flex items-center gap-2 h-9 px-4 bg-[#B8926A] hover:bg-[#A6825C] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Listing
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E8E6E3] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#1A1A1A]">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      {children}
    </div>
  )
}