import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PropertyForm } from "@/components/admin/property-form"

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!property) {
    return null
  }

  // Convert Decimal fields to strings for the form
  return {
    ...property,
    price: property.price.toString(),
    charges: property.charges?.toString() || "",
    livingArea: property.livingArea?.toString() || "",
    landArea: property.landArea?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    rooms: property.rooms?.toString() || "",
    floor: property.floor?.toString() || "",
    totalFloors: property.totalFloors?.toString() || "",
    yearBuilt: property.yearBuilt?.toString() || "",
    images: property.images.map((img) => ({
      url: img.url,
      alt: img.alt || "",
      isFloorplan: img.isFloorplan,
    })),
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Edit Property</h1>
        <p className="text-[#6B6B6B] mt-1">
          Update the details of "{property.title}"
        </p>
      </div>

      <PropertyForm
        initialData={{
          title: property.title,
          slug: property.slug,
          description: property.description,
          type: property.type,
          category: property.category,
          status: property.status,
          listingType: property.listingType,
          price: property.price,
          charges: property.charges,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          rooms: property.rooms,
          livingArea: property.livingArea,
          landArea: property.landArea,
          floor: property.floor,
          totalFloors: property.totalFloors,
          yearBuilt: property.yearBuilt,
          energyClass: property.energyClass || "",
          heatingType: property.heatingType || "",
          address: property.address,
          city: property.city,
          postalCode: property.postalCode,
          neighborhood: property.neighborhood || "",
          features: property.features,
          isFeatured: property.isFeatured,
          images: property.images,
        }}
        propertyId={property.id}
        mode="edit"
      />
    </div>
  )
}
