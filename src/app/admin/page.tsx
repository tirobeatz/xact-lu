import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getStats() {
  const [
    totalProperties,
    pendingProperties,
    publishedProperties,
    totalUsers,
    totalAgencies,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.property.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.agency.count(),
  ])

  return {
    totalProperties,
    pendingProperties,
    publishedProperties,
    totalUsers,
    totalAgencies,
  }
}

export default async function AdminOverviewPage() {
  const stats = await getStats()

  const statCards = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      href: "/admin/properties",
      color: "bg-blue-500",
    },
    {
      label: "Pending Review",
      value: stats.pendingProperties,
      href: "/admin/properties?status=PENDING_REVIEW",
      color: "bg-amber-500",
      urgent: stats.pendingProperties > 0,
    },
    {
      label: "Published",
      value: stats.publishedProperties,
      href: "/admin/properties?status=PUBLISHED",
      color: "bg-green-500",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      href: "/admin/users",
      color: "bg-purple-500",
    },
    {
      label: "Agencies",
      value: stats.totalAgencies,
      href: "/admin/agencies",
      color: "bg-pink-500",
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Dashboard Overview</h1>
        <p className="text-[#6B6B6B] mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`relative bg-white rounded-2xl border border-[#E8E6E3] p-5 hover:shadow-lg transition-shadow ${
              stat.urgent ? "ring-2 ring-amber-500" : ""
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <span className="text-white font-semibold">{stat.value}</span>
            </div>
            <p className="text-[#6B6B6B] text-sm">{stat.label}</p>
            {stat.urgent && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B8926A]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1A1A1A]">Add Property</p>
              <p className="text-xs text-[#6B6B6B]">Create new listing</p>
            </div>
          </Link>

          <Link
            href="/admin/properties?status=PENDING_REVIEW"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1A1A1A]">Review Properties</p>
              <p className="text-xs text-[#6B6B6B]">{stats.pendingProperties} pending</p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1A1A1A]">Manage Users</p>
              <p className="text-xs text-[#6B6B6B]">{stats.totalUsers} total</p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1A1A1A]">View Site</p>
              <p className="text-xs text-[#6B6B6B]">Open public site</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Activity</h2>
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
          <p className="text-[#6B6B6B] text-sm text-center py-8">
            Activity feed coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}