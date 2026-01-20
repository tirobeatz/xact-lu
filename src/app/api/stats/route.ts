import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [
      totalProperties,
      totalAgencies,
      totalValue,
      propertiesByType,
    ] = await Promise.all([
      // Total published properties
      prisma.property.count({
        where: { status: "PUBLISHED" },
      }),
      // Total verified agencies
      prisma.agency.count({
        where: { isVerified: true },
      }),
      // Total property value
      prisma.property.aggregate({
        where: { status: "PUBLISHED" },
        _sum: { price: true },
      }),
      // Properties by type count
      prisma.property.groupBy({
        by: ["type"],
        where: { status: "PUBLISHED" },
        _count: true,
      }),
    ])

    // Format property value
    const totalPropertyValue = Number(totalValue._sum.price || 0)
    const formattedValue = totalPropertyValue >= 1000000000
      ? `€${(totalPropertyValue / 1000000000).toFixed(1)}B`
      : totalPropertyValue >= 1000000
      ? `€${(totalPropertyValue / 1000000).toFixed(1)}M`
      : `€${totalPropertyValue.toLocaleString()}`

    // Format type counts
    const typeCounts: Record<string, number> = {}
    propertiesByType.forEach((item) => {
      typeCounts[item.type] = item._count
    })

    const response = NextResponse.json({
      stats: {
        activeListings: `${totalProperties.toLocaleString()}+`,
        propertyValue: formattedValue,
        satisfiedClients: "98%",
      },
      categories: {
        Apartments: typeCounts.APARTMENT || 0,
        Houses: typeCounts.HOUSE || 0,
        Villas: typeCounts.VILLA || 0,
        Land: typeCounts.LAND || 0,
        Commercial: (typeCounts.OFFICE || 0) + (typeCounts.COMMERCIAL || 0),
        Studios: typeCounts.STUDIO || 0,
      },
      totalAgencies,
    })

    // Add cache headers for stats (5 minutes cache, stats don't change often)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return response
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
