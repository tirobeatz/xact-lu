import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const property = await prisma.property.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        agency: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            phone: true,
            email: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }

    // Get similar properties (same city or type, excluding current)
    const similarProperties = await prisma.property.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: property.id },
        OR: [
          { city: property.city },
          { type: property.type },
        ],
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    })

    // Transform property data
    const transformedProperty = {
      id: property.id,
      title: property.title,
      slug: property.slug,
      description: property.description,
      location: property.city,
      address: `${property.address}, ${property.city}`,
      price: Number(property.price),
      type: property.type,
      listingType: property.listingType,
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      area: property.livingArea ? Number(property.livingArea) : 0,
      landArea: property.landArea ? Number(property.landArea) : undefined,
      yearBuilt: property.yearBuilt || undefined,
      energyClass: property.energyClass || undefined,
      floor: property.floor || undefined,
      totalFloors: property.totalFloors || undefined,
      features: property.features || [],
      images: property.images.length > 0
        ? property.images.map((img) => img.url)
        : ["/placeholder-property.svg"],
      agent: property.agent ? {
        name: property.agent.name,
        phone: property.agent.phone || "+352 621 000 000",
        email: property.agent.email,
        image: property.agent.image || "/xact-logo.svg",
        agency: "Xact",
      } : {
        name: "Xact Real Estate",
        phone: "+352 621 000 000",
        email: "info@xact.lu",
        image: "/xact-logo.svg",
        agency: "Xact",
      },
    }

    // Transform similar properties
    const transformedSimilar = similarProperties.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      location: p.city,
      price: Number(p.price),
      type: p.type,
      listingType: p.listingType,
      beds: p.bedrooms || 0,
      baths: p.bathrooms || 0,
      area: p.livingArea ? Number(p.livingArea) : 0,
      image: p.images[0]?.url || "/placeholder-property.svg",
    }))

    return NextResponse.json({
      property: transformedProperty,
      similarProperties: transformedSimilar,
    })
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    )
  }
}
