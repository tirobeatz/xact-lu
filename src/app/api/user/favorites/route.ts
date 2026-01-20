import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/favorites - Get user's favorite properties
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if checking single property status
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (propertyId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: session.user.id,
            propertyId,
          },
        },
      });
      return NextResponse.json({ isFavorite: !!favorite });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        property: {
          include: {
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data for frontend
    const transformedFavorites = favorites.map((fav) => ({
      id: fav.id,
      propertyId: fav.property.id,
      title: fav.property.title,
      slug: fav.property.slug,
      address: `${fav.property.address}, ${fav.property.city}`,
      price: Number(fav.property.price),
      listingType: fav.property.listingType,
      bedrooms: fav.property.bedrooms,
      bathrooms: fav.property.bathrooms,
      livingArea: fav.property.livingArea ? Number(fav.property.livingArea) : null,
      image: fav.property.images[0]?.url || "/placeholder-property.jpg",
      savedAt: fav.createdAt,
    }));

    return NextResponse.json(transformedFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

// POST /api/user/favorites - Add property to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already in favorites" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

// DELETE /api/user/favorites - Remove property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Support both query params and JSON body
    const { searchParams } = new URL(request.url);
    let propertyId = searchParams.get("propertyId");
    let favoriteId = searchParams.get("id");

    // Try to get from body if not in query params
    if (!propertyId && !favoriteId) {
      try {
        const body = await request.json();
        propertyId = body.propertyId;
        favoriteId = body.id;
      } catch {
        // No body provided
      }
    }

    if (!propertyId && !favoriteId) {
      return NextResponse.json({ error: "Property ID or Favorite ID is required" }, { status: 400 });
    }

    if (favoriteId) {
      // Delete by favorite ID
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
          userId: session.user.id,
        },
      });
    } else if (propertyId) {
      // Delete by property ID
      await prisma.favorite.delete({
        where: {
          userId_propertyId: {
            userId: session.user.id,
            propertyId,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
