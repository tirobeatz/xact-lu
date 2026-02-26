import { prisma } from "@/lib/prisma"
import PropertiesContent from "./properties-content"
import type { Property } from "./properties-content"

// Fetch initial properties on the server for SEO
async function getInitialProperties() {
  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          title: true,
          slug: true,
          titleTranslations: true,
          city: true,
          address: true,
          price: true,
          type: true,
          listingType: true,
          bedrooms: true,
          bathrooms: true,
          livingArea: true,
          latitude: true,
          longitude: true,
          isFeatured: true,
          images: {
            select: { url: true },
            orderBy: { order: "asc" },
            take: 1,
          },
        },
      }),
      prisma.property.count({ where: { status: "PUBLISHED" } }),
    ])

    const transformedProperties: Property[] = properties.map((property) => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      titleTranslations: property.titleTranslations as Record<string, string> | null,
      location: property.city,
      price: Number(property.price),
      type: property.type,
      listingType: property.listingType,
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      area: property.livingArea ? Number(property.livingArea) : 0,
      latitude: property.latitude ? Number(property.latitude) : null,
      longitude: property.longitude ? Number(property.longitude) : null,
      image: property.images[0]?.url || "/placeholder-property.svg",
      tag: property.isFeatured ? "Featured" : property.listingType === "RENT" ? "Rental" : "For Sale",
    }))

    return {
      properties: transformedProperties,
      total,
      totalPages: Math.ceil(total / 12),
    }
  } catch {
    return {
      properties: [],
      total: 0,
      totalPages: 1,
    }
  }
}

export default async function PropertiesPage() {
  const { properties, total, totalPages } = await getInitialProperties()

  return (
    <PropertiesContent
      initialProperties={properties}
      initialTotal={total}
      initialTotalPages={totalPages}
    />
  )
}
