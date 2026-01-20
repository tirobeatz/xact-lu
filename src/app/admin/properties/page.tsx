import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PropertyStatus } from "@prisma/client"
import { PropertyActions } from "@/components/admin/property-actions"

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>
}

async function getProperties(status?: string, page = 1) {
  const pageSize = 20
  const where = status ? { status: status as PropertyStatus } : {}

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true } },
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ])

  // Serialize properties to avoid Decimal issues with Client Components
  const serializedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title,
    slug: property.slug,
    type: property.type,
    listingType: property.listingType,
    status: property.status,
    city: property.city,
    price: Number(property.price),
    isFeatured: property.isFeatured,
    createdAt: property.createdAt.toISOString(),
    owner: property.owner,
    images: property.images,
  }))

  return { properties: serializedProperties, total, pageSize }
}

const statusColors: Record<PropertyStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  RESERVED: "bg-blue-100 text-blue-700",
  SOLD: "bg-purple-100 text-purple-700",
  RENTED: "bg-purple-100 text-purple-700",
  EXPIRED: "bg-gray-100 text-gray-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
}

const statusFilters: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Sold", value: "SOLD" },
  { label: "Rented", value: "RENTED" },
]

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const status = resolvedParams.status
  const page = parseInt(resolvedParams.page || "1")
  const { properties, total, pageSize } = await getProperties(status, page)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Properties</h1>
          <p className="text-[#6B6B6B] mt-1">{total} total properties</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 h-10 px-4 bg-[#B8926A] hover:bg-[#A6825C] text-white text-sm font-medium rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/properties?status=${filter.value}` : "/admin/properties"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === filter.value || (!status && !filter.value)
                ? "bg-[#1A1A1A] text-white"
                : "bg-white border border-[#E8E6E3] text-[#6B6B6B] hover:border-[#1A1A1A]"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B6B6B]">No properties found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E6E3] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E3]">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#E8E6E3] overflow-hidden flex-shrink-0">
                          {property.images[0] ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6B6B6B]">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/properties/${property.id}`}
                              className="font-medium text-[#1A1A1A] hover:text-[#B8926A] truncate block max-w-[200px]"
                            >
                              {property.title}
                            </Link>
                            {property.isFeatured && (
                              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-[#6B6B6B]">
                            {property.type} · {property.listingType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{property.city}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        €{property.price.toLocaleString("de-LU")}
                        {property.listingType === "RENT" && <span className="text-[#6B6B6B] font-normal">/mo</span>}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
                        {property.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{property.owner.name || "—"}</p>
                      <p className="text-xs text-[#6B6B6B] truncate max-w-[150px]">{property.owner.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#6B6B6B]">
                        {new Date(property.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <PropertyActions property={{
                        id: property.id,
                        status: property.status,
                        slug: property.slug,
                        isFeatured: property.isFeatured,
                      }} />
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
                  href={`/admin/properties?${status ? `status=${status}&` : ""}page=${page - 1}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E6E3] hover:bg-[#F5F3EF] transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/properties?${status ? `status=${status}&` : ""}page=${page + 1}`}
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
