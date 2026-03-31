import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { geocodeAddress } from "@/lib/geocode"
import { propertySchema } from "@/lib/validations/property"

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let data
  try {
    const raw = await request.json()
    data = propertySchema.parse(raw)
  } catch (err: any) {
    return NextResponse.json(
      { error: "Validation failed", details: err.errors || err.message },
      { status: 400 }
    )
  }

  // Check if slug already exists
  const existing = await prisma.property.findUnique({
    where: { slug: data.slug },
  })

  if (existing) {
    return NextResponse.json(
      { error: "A property with this slug already exists" },
      { status: 400 }
    )
  }

  try {
    // Auto-geocode address to get lat/lng for maps
    const geo = await geocodeAddress(data.address, data.city, data.postalCode)

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        titleTranslations: data.titleTranslations || null,
        descriptionTranslations: data.descriptionTranslations || null,
        type: data.type,
        category: data.category,
        status: data.status,
        listingType: data.listingType,
        price: data.price,
        charges: data.charges,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        rooms: data.rooms,
        livingArea: data.livingArea,
        landArea: data.landArea,
        floor: data.floor,
        totalFloors: data.totalFloors,
        yearBuilt: data.yearBuilt,
        energyClass: data.energyClass,
        heatingType: data.heatingType,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        neighborhood: data.neighborhood,
        latitude: geo?.latitude ?? null,
        longitude: geo?.longitude ?? null,
        features: data.features,
        isFeatured: data.isFeatured,
        agentId: data.agentId || null,
        ownerId: session.user.id,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        images: {
          create: data.images.map((img, index) => ({
            url: img.url,
            alt: img.alt || null,
            order: index,
            isFloorplan: img.isFloorplan || false,
          })),
        },
      },
    })

    return NextResponse.json(property)
  } catch (err: any) {
    console.error("Failed to create property:", err)
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    )
  }
}
