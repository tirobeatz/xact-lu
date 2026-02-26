import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PropertyDetailContent from "./property-detail-content"
import type { Property, SimilarProperty } from "./property-detail-content"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

// Dynamic SEO metadata for each property page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const property = await prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      price: true,
      type: true,
      listingType: true,
      city: true,
      address: true,
      bedrooms: true,
      bathrooms: true,
      livingArea: true,
      images: {
        orderBy: { order: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  })

  if (!property) {
    return {
      title: "Property Not Found | Xact Real Estate",
      description: "The property you are looking for could not be found.",
    }
  }

  const price = `€${Number(property.price).toLocaleString("en-US")}`
  const listingLabel = property.listingType === "RENT" ? "For Rent" : "For Sale"
  const title = `${property.title} - ${price} | Xact Real Estate`
  const area = property.livingArea ? `${Number(property.livingArea)}m²` : ""
  const specs = [
    property.bedrooms ? `${property.bedrooms} bed${property.bedrooms > 1 ? "s" : ""}` : "",
    property.bathrooms ? `${property.bathrooms} bath${property.bathrooms > 1 ? "s" : ""}` : "",
    area,
  ].filter(Boolean).join(", ")
  const description = `${property.type.charAt(0) + property.type.slice(1).toLowerCase()} ${listingLabel.toLowerCase()} in ${property.city}. ${specs ? specs + ". " : ""}${listingLabel} at ${price}.`
  const image = property.images[0]?.url || "/xact-logo.svg"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: property.title }],
      type: "website",
      siteName: "Xact Real Estate",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

// Fetch property data on the server
async function getPropertyData(slug: string) {
  const property = await prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      images: {
        orderBy: { order: "asc" },
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
    },
  })

  if (!property) return null

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

  // Transform property data (same logic as API route)
  const transformedProperty: Property = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    titleTranslations: property.titleTranslations as Record<string, string> | null,
    descriptionTranslations: property.descriptionTranslations as Record<string, string> | null,
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
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
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
  const transformedSimilar: SimilarProperty[] = similarProperties.map((p) => ({
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

  return { property: transformedProperty, similarProperties: transformedSimilar }
}

// Build JSON-LD structured data for Google rich results
function buildJsonLd(property: Property) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://xact.lu/properties/${property.slug}`,
    datePosted: new Date().toISOString(),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  }

  // Add images
  if (property.images.length > 0 && !property.images[0].includes("placeholder")) {
    jsonLd.image = property.images.map((img) =>
      img.startsWith("http") ? img : `https://xact.lu${img}`
    )
  }

  // Add geo coordinates
  if (property.latitude && property.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    }
  }

  // Add address
  jsonLd.address = {
    "@type": "PostalAddress",
    streetAddress: property.address.split(",")[0]?.trim() || property.address,
    addressLocality: property.location,
    addressCountry: "LU",
  }

  // Add property details via additionalProperty
  const additionalProperties = []
  if (property.beds > 0) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "numberOfBedrooms",
      value: property.beds,
    })
  }
  if (property.baths > 0) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "numberOfBathrooms",
      value: property.baths,
    })
  }
  if (property.area > 0) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "floorSize",
      value: `${property.area} m²`,
    })
  }
  if (property.energyClass) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "energyClass",
      value: property.energyClass,
    })
  }
  if (property.yearBuilt) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "yearBuilt",
      value: property.yearBuilt,
    })
  }
  if (additionalProperties.length > 0) {
    jsonLd.additionalProperty = additionalProperties
  }

  return jsonLd
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const data = await getPropertyData(slug)

  if (!data) {
    notFound()
  }

  const jsonLd = buildJsonLd(data.property)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailContent
        property={data.property}
        similarProperties={data.similarProperties}
      />
    </>
  )
}
