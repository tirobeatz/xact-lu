import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

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
      features: data.features,
      isFeatured: data.isFeatured,
      ownerId: session.user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      images: {
        create: data.images.map((img: any, index: number) => ({
          url: img.url,
          alt: img.alt || null,
          order: index,
          isFloorplan: img.isFloorplan || false,
        })),
      },
    },
  })

  return NextResponse.json(property)
}