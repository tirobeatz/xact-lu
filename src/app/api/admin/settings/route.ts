import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/settings - Get site settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create default settings
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    })

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          siteName: "Xact Real Estate",
          email: "info@xact.lu",
          phone: "+352 621 000 000",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { siteName, siteDescription, logo, email, phone, address } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName,
        siteDescription,
        logo,
        email,
        phone,
        address,
      },
      create: {
        id: "default",
        siteName: siteName || "Xact Real Estate",
        siteDescription,
        logo,
        email: email || "info@xact.lu",
        phone: phone || "+352 621 000 000",
        address,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
