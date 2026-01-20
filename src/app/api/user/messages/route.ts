import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/messages - Get messages for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { toUserId: session.user.id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            address: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data for frontend
    const transformedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      fromName: msg.fromName,
      fromEmail: msg.fromEmail,
      fromPhone: msg.fromPhone,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      property: {
        id: msg.property.id,
        title: msg.property.title,
        slug: msg.property.slug,
        address: `${msg.property.address}, ${msg.property.city}`,
      },
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/user/messages - Send a message (for public contact forms)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, fromName, fromEmail, fromPhone, content } = body;

    if (!propertyId || !fromName || !fromEmail || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get property to find owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fromName,
        fromEmail,
        fromPhone: fromPhone || null,
        propertyId,
        toUserId: property.ownerId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
