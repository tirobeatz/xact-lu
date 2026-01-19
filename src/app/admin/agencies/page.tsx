import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AgencyActions } from "@/components/admin/agency-actions"

interface Props {
  searchParams: Promise<{ verified?: string; page?: string; search?: string }>
}

async function getAgencies(verified?: string, page = 1, search?: string) {
  const pageSize = 20
  const where: any = {}

  if (verified === "true") {
    where.isVerified = true
  } else if (verified === "false") {
    where.isVerified = false
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [agencies, total] = await Promise.all([
    prisma.agency.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true } },
        _count: {
          select: { properties: true, members: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.agency.count({ where }),
  ])

  return { agencies, total, pageSize }
}

const filters: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Verified", value: "true" },
  { label: "Pending", value: "false" },
]

export default async function AdminAgenciesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const verified = resolvedParams.verified
  const search = resolvedParams.search
  const page = parseInt(resolvedParams.page || "1")
  const { agencies, total, pageSize } = await getAgencies(verified, page, search)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Agencies</h1>
          <p className="text-[#6B6B6B] mt-1">{total} total agencies</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form className="flex-1 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name or email..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors text-sm"
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Link
              key={filter.label}
              href={
                filter.value !== undefined
                  ? `/admin/agencies?verified=${filter.value}${search ? `&search=${search}` : ""}`
                  : `/admin/agencies${search ? `?search=${search}` : ""}`
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                verified === filter.value || (verified === undefined && filter.value === undefined)
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-[#E8E6E3] text-[#6B6B6B] hover:border-[#1A1A1A]"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Agencies Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden">
        {agencies.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B6B6B]">No agencies found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E6E3] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Members
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E3]">
                {agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#B8926A]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {agency.logo ? (
                            <img
                              src={agency.logo}
                              alt={agency.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-5 h-5 text-[#B8926A]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1A1A1A] truncate max-w-[200px]">
                            {agency.name}
                          </p>
                          <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">
                            {agency.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{agency.owner.name || "—"}</p>
                      <p className="text-xs text-[#6B6B6B] truncate max-w-[150px]">
                        {agency.owner.email}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{agency._count.properties}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{agency._count.members}</p>
                    </td>
                    <td className="px-4 py-4">
                      {agency.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#6B6B6B]">
                        {new Date(agency.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <AgencyActions agency={agency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E6E3]">
            <p className="text-sm text-[#6B6B6B]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/agencies?${verified !== undefined ? `verified=${verified}&` : ""}${search ? `search=${search}&` : ""}page=${page - 1}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E6E3] hover:bg-[#F5F3EF] transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/agencies?${verified !== undefined ? `verified=${verified}&` : ""}${search ? `search=${search}&` : ""}page=${page + 1}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E6E3] hover:bg-[#F5F3EF] transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
