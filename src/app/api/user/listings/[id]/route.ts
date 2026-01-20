import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const listing = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if user owns this listing
    if (listing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

// PUT /api/user/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if listing exists and user owns it
    const existingListing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      title,
      description,
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

    // Update slug if title changed
    let slug = existingListing.slug;
    if (title && title !== existingListing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existingSlugs = await prisma.property.findMany({
        where: {
          slug: { startsWith: baseSlug },
          id: { not: id },
        },
        select: { slug: true },
      });

      slug = baseSlug;
      if (existingSlugs.length > 0) {
        slug = `${baseSlug}-${existingSlugs.length + 1}`;
      }
    }

    const updatedListing = await prisma.property.update({
      where: { id },
      data: {
        title: title || existingListing.title,
        slug,
        description: description !== undefined ? description : existingListing.description,
        type: type || existingListing.type,
        category: category || existingListing.category,
        listingType: listingType || existingListing.listingType,
        price: price !== undefined ? price : existingListing.price,
        bedrooms: bedrooms !== undefined ? (bedrooms ? parseInt(bedrooms) : null) : existingListing.bedrooms,
        bathrooms: bathrooms !== undefined ? (bathrooms ? parseInt(bathrooms) : null) : existingListing.bathrooms,
        livingArea: livingArea !== undefined ? (livingArea ? parseFloat(livingArea) : null) : existingListing.livingArea,
        landArea: landArea !== undefined ? (landArea ? parseFloat(landArea) : null) : existingListing.landArea,
        floor: floor !== undefined ? (floor ? parseInt(floor) : null) : existingListing.floor,
        totalFloors: totalFloors !== undefined ? (totalFloors ? parseInt(totalFloors) : null) : existingListing.totalFloors,
        yearBuilt: yearBuilt !== undefined ? (yearBuilt ? parseInt(yearBuilt) : null) : existingListing.yearBuilt,
        energyClass: energyClass !== undefined ? energyClass : existingListing.energyClass,
        address: address || existingListing.address,
        city: city || existingListing.city,
        postalCode: postalCode !== undefined ? postalCode : existingListing.postalCode,
        features: features !== undefined ? features : existingListing.features,
        // Reset to pending review after edit
        status: existingListing.status === "PUBLISHED" ? "PENDING_REVIEW" : existingListing.status,
      },
      include: {
        images: true,
      },
    });

    // Handle images update if provided
    if (images !== undefined && Array.isArray(images)) {
      // Delete existing images
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      // Create new images
      if (images.length > 0) {
        await prisma.propertyImage.createMany({
          data: images.map((url: string, index: number) => ({
            url,
            order: index,
            propertyId: id,
          })),
        });
      }

      // Fetch updated listing with new images
      const listingWithImages = await prisma.property.findUnique({
        where: { id },
        include: { images: true },
      });

      return NextResponse.json(listingWithImages);
    }

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

// DELETE /api/user/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if listing exists and user owns it
    const existingListing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
