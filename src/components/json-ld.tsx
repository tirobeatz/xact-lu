interface PropertyJsonLdProps {
  title: string
  description: string
  price: number
  currency?: string
  address: string
  city: string
  images: string[]
  beds?: number
  baths?: number
  area?: number
  listingType: "SALE" | "RENT"
  url: string
  agentName?: string
  agentPhone?: string
}

export function PropertyJsonLd({
  title,
  description,
  price,
  currency = "EUR",
  address,
  city,
  images,
  beds,
  baths,
  area,
  listingType,
  url,
  agentName,
  agentPhone,
}: PropertyJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description: description.substring(0, 300),
    url,
    image: images,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressCountry: "LU",
    },
    ...(beds && { numberOfBedrooms: beds }),
    ...(baths && { numberOfBathroomsTotal: baths }),
    ...(area && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: area,
        unitCode: "MTK",
      },
    }),
    ...(agentName && {
      agent: {
        "@type": "RealEstateAgent",
        name: agentName,
        ...(agentPhone && { telephone: agentPhone }),
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
  email?: string
  phone?: string
  address?: string
}

export function OrganizationJsonLd({
  name = "Xact Real Estate",
  url = "https://xact.lu",
  logo = "https://xact.lu/xact-logo.svg",
  email = "info@xact.lu",
  phone = "+352 123 456 789",
  address = "Luxembourg City, Luxembourg",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    url,
    logo,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressCountry: "LU",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
