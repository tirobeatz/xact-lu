import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { geocodeAddress } from "@/lib/geocode"
import { propertySchema } from "@/lib/validations/property"

function revalidatePropertyPaths(slug?: string) {
  revalidatePath("/")
  revalidatePath("/properties")
  revalidatePath("/en")
  revalidatePath("/de")
  revalidatePath("/fr")
  revalidatePath("/en/properties")
  revalidatePath("/de/properties")
  revalidatePath("/fr/properties")
  if (slug) {
    revalidatePath(`/properties/${slug}`)
    revalidatePath(`/en/properties/${slug}`)
    revalidatePath(`/de/properties/${slug}`)
    revalidatePath(`/fr/properties/${slug}`)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

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

  try {
    // Auto-geocode address to get lat/lng for maps
    const geo = await geocodeAddress(data.address, data.city, data.postalCode)

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
        titleTranslations: (data.titleTranslations ?? undefined) as any,
        descriptionTranslations: (data.descriptionTranslations ?? undefined) as any,
        type: data.type as any,
        category: data.category as any,
        status: data.status as any,
        listingType: data.listingType as any,
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
        energyClass: data.energyClass as any,
        heatingType: data.heatingType as any,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        neighborhood: data.neighborhood,
        latitude: geo?.latitude ?? null,
        longitude: geo?.longitude ?? null,
        features: data.features as any,
        isFeatured: data.isFeatured,
        agentId: data.agentId || null,
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

    revalidatePropertyPaths(property.slug)

    return NextResponse.json(property)
  } catch (err: any) {
    console.error("Failed to update property:", err)
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    )
  }
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

  try {
    const deleted = await prisma.property.delete({
      where: { id },
      select: { slug: true },
    })

    revalidatePropertyPaths(deleted.slug)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Failed to delete property:", err)
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    )
  }
}
