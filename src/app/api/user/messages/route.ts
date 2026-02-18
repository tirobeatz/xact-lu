import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeInput, sanitizeEmail } from "@/lib/sanitize";

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
    // Apply rate limiting
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`message:${ip}`, RATE_LIMITS.message)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const body = await request.json();
    const { propertyId, fromName, fromEmail, fromPhone, content } = body;

    // Sanitize inputs
    const sanitizedFromName = sanitizeInput(fromName);
    const sanitizedFromEmail = sanitizeEmail(fromEmail);
    const sanitizedContent = sanitizeInput(content);

    // Validate required fields
    if (!propertyId || !sanitizedFromName || !sanitizedFromEmail || !sanitizedContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedFromEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate field lengths to prevent abuse
    if (sanitizedFromName.length > 100 || sanitizedFromEmail.length > 255 || sanitizedContent.length > 5000) {
      return NextResponse.json({ error: "Field length exceeded" }, { status: 400 });
    }

    if (fromPhone && fromPhone.length > 30) {
      return NextResponse.json({ error: "Phone number too long" }, { status: 400 });
    }

    // Basic spam protection - check for recent messages from same email
    const recentMessage = await prisma.message.findFirst({
      where: {
        fromEmail: sanitizedFromEmail,
        createdAt: { gte: new Date(Date.now() - 60000) }, // Last minute
      },
    });

    if (recentMessage) {
      return NextResponse.json({ error: "Please wait before sending another message" }, { status: 429 });
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
        content: sanitizedContent,
        fromName: sanitizedFromName,
        fromEmail: sanitizedFromEmail,
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
