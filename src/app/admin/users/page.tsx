import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { UserRole } from "@prisma/client"
import { UserActions } from "@/components/admin/user-actions"

interface Props {
  searchParams: Promise<{ role?: string; page?: string; search?: string }>
}

async function getUsers(role?: string, page = 1, search?: string) {
  const pageSize = 20
  const where: any = {}

  if (role) {
    where.role = role as UserRole
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: {
          select: { properties: true },
        },
        agency: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, pageSize }
}

const roleColors: Record<UserRole, string> = {
  USER: "bg-gray-100 text-gray-700",
  AGENT: "bg-blue-100 text-blue-700",
  AGENCY_OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-red-100 text-red-700",
}

const roleLabels: Record<UserRole, string> = {
  USER: "User",
  AGENT: "Agent",
  AGENCY_OWNER: "Agency Owner",
  ADMIN: "Admin",
}

const roleFilters: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Users", value: "USER" },
  { label: "Agents", value: "AGENT" },
  { label: "Agency Owners", value: "AGENCY_OWNER" },
  { label: "Admins", value: "ADMIN" },
]

export default async function AdminUsersPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const role = resolvedParams.role
  const search = resolvedParams.search
  const page = parseInt(resolvedParams.page || "1")
  const { users, total, pageSize } = await getUsers(role, page, search)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Users</h1>
          <p className="text-[#6B6B6B] mt-1">{total} total users</p>
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
          {roleFilters.map((filter) => (
            <Link
              key={filter.label}
              href={
                filter.value
                  ? `/admin/users?role=${filter.value}${search ? `&search=${search}` : ""}`
                  : `/admin/users${search ? `?search=${search}` : ""}`
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === filter.value || (!role && !filter.value)
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-[#E8E6E3] text-[#6B6B6B] hover:border-[#1A1A1A]"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B6B6B]">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E6E3] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E3]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#B8926A] flex items-center justify-center text-white font-medium flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1A1A1A] truncate max-w-[200px]">
                            {user.name || "—"}
                          </p>
                          <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          roleColors[user.role]
                        }`}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">
                        {user.agency?.name || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{user._count.properties}</p>
                    </td>
                    <td className="px-4 py-4">
                      {user.isVerified ? (
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
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#6B6B6B]">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <UserActions user={user} />
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
                  href={`/admin/users?${role ? `role=${role}&` : ""}${search ? `search=${search}&` : ""}page=${page - 1}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E6E3] hover:bg-[#F5F3EF] transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/users?${role ? `role=${role}&` : ""}${search ? `search=${search}&` : ""}page=${page + 1}`}
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
