import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Check if user is logged in and is ADMIN
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AdminSidebar user={session.user} />
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}