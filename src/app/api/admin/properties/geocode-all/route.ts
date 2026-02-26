import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { geocodeAddress } from "@/lib/geocode"

/**
 * POST /api/admin/properties/geocode-all
 * Backfill latitude/longitude for all properties that don't have coordinates yet.
 * Admin-only endpoint. Respects Nominatim 1 req/sec rate limit.
 */
export async function POST() {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find properties without coordinates
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { latitude: null },
        { longitude: null },
      ],
    },
    select: {
      id: true,
      title: true,
      address: true,
      city: true,
      postalCode: true,
    },
  })

  if (properties.length === 0) {
    return NextResponse.json({
      message: "All properties already have coordinates",
      updated: 0,
      total: 0,
    })
  }

  let updated = 0
  const results: { title: string; success: boolean; coords?: string }[] = []

  for (const property of properties) {
    // Nominatim rate limit: max 1 request per second
    if (updated > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    }

    const geo = await geocodeAddress(property.address, property.city, property.postalCode)

    if (geo) {
      await prisma.property.update({
        where: { id: property.id },
        data: {
          latitude: geo.latitude,
          longitude: geo.longitude,
        },
      })
      updated++
      results.push({
        title: property.title,
        success: true,
        coords: `${geo.latitude}, ${geo.longitude}`,
      })
    } else {
      results.push({
        title: property.title,
        success: false,
      })
    }
  }

  return NextResponse.json({
    message: `Geocoded ${updated} of ${properties.length} properties`,
    updated,
    total: properties.length,
    results,
  })
}
