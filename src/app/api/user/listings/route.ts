import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/listings - Get current user's property listings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      ownerId: session.user.id,
    };

    // Filter by status if provided
    if (status && status !== "all") {
      if (status === "active") {
        where.status = "PUBLISHED";
      } else if (status === "pending") {
        where.status = { in: ["DRAFT", "PENDING_REVIEW"] };
      } else if (status === "sold") {
        where.status = { in: ["SOLD", "RENTED"] };
      }
    }

    const listings = await prisma.property.findMany({
      where,
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            favorites: true,
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data for frontend
    const transformedListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      address: `${listing.address}, ${listing.city}`,
      price: Number(listing.price),
      listingType: listing.listingType,
      status: listing.status,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      livingArea: listing.livingArea ? Number(listing.livingArea) : null,
      image: listing.images[0]?.url || "/placeholder-property.svg",
      viewCount: listing.viewCount,
      inquiryCount: listing._count.messages,
      favoriteCount: listing._count.favorites,
      createdAt: listing.createdAt,
      publishedAt: listing.publishedAt,
    }));

    return NextResponse.json(transformedListings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST /api/user/listings - Create a new property listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      titleTranslations,
      descriptionTranslations,
      type,
      category,
      listingType,
      price,
      bedrooms,
      bathrooms,
      livingArea,
      landArea,
      floor,
      totalFloors,
      yearBuilt,
      energyClass,
      address,
      city,
      postalCode,
      features,
      images,
    } = body;

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for existing slug and make unique if necessary
    const existingSlugs = await prisma.property.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });

    let slug = baseSlug;
    if (existingSlugs.length > 0) {
      slug = `${baseSlug}-${existingSlugs.length + 1}`;
    }

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        description,
        titleTranslations: titleTranslations || null,
        descriptionTranslations: descriptionTranslations || null,
        type,
        category: category || "RESIDENTIAL",
        listingType,
        price,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        livingArea: livingArea ? parseFloat(livingArea) : null,
        landArea: landArea ? parseFloat(landArea) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        energyClass: energyClass || null,
        address,
        city,
        postalCode,
        features: features || [],
        status: "PENDING_REVIEW",
        ownerId: session.user.id,
        images: images?.length
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
