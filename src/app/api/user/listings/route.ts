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

    // Validate required fields
    if (!title || !type || !listingType || !price || !address || !city) {
      return NextResponse.json(
        { error: "Missing required fields: title, type, listingType, price, address, and city are required" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length > 200) {
      return NextResponse.json({ error: "Title is too long (max 200 characters)" }, { status: 400 });
    }

    if (description && description.length > 10000) {
      return NextResponse.json({ error: "Description is too long (max 10000 characters)" }, { status: 400 });
    }

    if (address.length > 300 || city.length > 100) {
      return NextResponse.json({ error: "Address or city is too long" }, { status: 400 });
    }

    // Validate type and listingType enums
    const validTypes = ["APARTMENT", "HOUSE", "VILLA", "PENTHOUSE", "STUDIO", "DUPLEX", "OFFICE", "LAND", "COMMERCIAL"];
    const validListingTypes = ["SALE", "RENT"];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid property type" }, { status: 400 });
    }

    if (!validListingTypes.includes(listingType)) {
      return NextResponse.json({ error: "Invalid listing type" }, { status: 400 });
    }

    // Validate price is a positive number
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 1000000000) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // Validate numeric fields if provided
    if (bedrooms !== undefined && (isNaN(Number(bedrooms)) || Number(bedrooms) < 0 || Number(bedrooms) > 100)) {
      return NextResponse.json({ error: "Invalid bedroom count" }, { status: 400 });
    }

    if (bathrooms !== undefined && (isNaN(Number(bathrooms)) || Number(bathrooms) < 0 || Number(bathrooms) > 100)) {
      return NextResponse.json({ error: "Invalid bathroom count" }, { status: 400 });
    }

    // Validate images array
    if (images && (!Array.isArray(images) || images.length > 50)) {
      return NextResponse.json({ error: "Invalid images (max 50 images)" }, { status: 400 });
    }

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
