import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()

  // Check if slug already exists for another property
  const existing = await prisma.property.findFirst({
    where: {
      slug: data.slug,
      id: { not: id },
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: "A property with this slug already exists" },
      { status: 400 }
    )
  }

  // Delete existing images and recreate
  await prisma.propertyImage.deleteMany({
    where: { propertyId: id },
  })

  const property = await prisma.property.update({
    where: { id },
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
      agentId: data.agentId || null,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.property.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}

