import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Filter parameters
  const listingType = searchParams.get("listingType")
  const propertyType = searchParams.get("propertyType")
  const location = searchParams.get("location")
  const minBeds = searchParams.get("minBeds")
  const maxPrice = searchParams.get("maxPrice")
  const minArea = searchParams.get("minArea")
  const sortBy = searchParams.get("sortBy") || "newest"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const featured = searchParams.get("featured")

  // Build where clause
  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  }

  if (listingType && listingType !== "ALL") {
    where.listingType = listingType
  }

  if (propertyType && propertyType !== "All") {
    where.type = propertyType.toUpperCase()
  }

  if (location && location !== "All") {
    where.city = location
  }

  if (minBeds) {
    where.bedrooms = { gte: parseInt(minBeds) }
  }

  if (maxPrice) {
    where.price = { lte: parseInt(maxPrice) }
  }

  if (minArea) {
    where.livingArea = { gte: parseInt(minArea) }
  }

  if (featured === "true") {
    where.isFeatured = true
  }

  // Build order by
  let orderBy: Record<string, string> = { createdAt: "desc" }

  switch (sortBy) {
    case "price-low":
      orderBy = { price: "asc" }
      break
    case "price-high":
      orderBy = { price: "desc" }
      break
    case "area-high":
      orderBy = { livingArea: "desc" }
      break
    case "beds-high":
      orderBy = { bedrooms: "desc" }
      break
    default:
      orderBy = { createdAt: "desc" }
  }

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
          agency: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ])

    // Transform data for frontend
    const transformedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      location: property.city,
      address: `${property.address}, ${property.city}`,
      price: Number(property.price),
      type: property.type,
      listingType: property.listingType,
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      area: property.livingArea ? Number(property.livingArea) : 0,
      image: property.images[0]?.url || "/placeholder-property.svg",
      tag: property.isFeatured ? "Featured" : property.listingType === "RENT" ? "Rental" : "For Sale",
      agency: property.agency,
    }))

    return NextResponse.json({
      properties: transformedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    )
  }
}
