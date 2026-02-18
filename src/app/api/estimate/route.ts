import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeInput, sanitizeEmail } from "@/lib/sanitize";

// POST /api/estimate - Handle property estimation requests
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`estimate:${ip}`, RATE_LIMITS.estimate)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      propertyType,
      address,
      city,
      postalCode,
      livingArea,
      landArea,
      bedrooms,
      bathrooms,
      yearBuilt,
      condition,
      features,
      description,
      images,
    } = body;

    // Sanitize string inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedAddress = sanitizeInput(address);
    const sanitizedCity = sanitizeInput(city);
    const sanitizedDescription = description ? sanitizeInput(description) : null;

    // Validate required fields
    if (!sanitizedName || !sanitizedEmail || !propertyType || !sanitizedAddress || !sanitizedCity) {
      return NextResponse.json(
        { error: "Name, email, property type, address, and city are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate field lengths
    if (sanitizedName.length > 100 || sanitizedEmail.length > 255 || sanitizedAddress.length > 300) {
      return NextResponse.json({ error: "Field length exceeded" }, { status: 400 });
    }

    // Rate limiting - check for recent submissions from same email
    const recentSubmission = await prisma.estimateRequest.findFirst({
      where: {
        email: sanitizedEmail,
        createdAt: { gte: new Date(Date.now() - 3600000) }, // Last hour
      },
    });

    if (recentSubmission) {
      return NextResponse.json(
        { error: "You have already submitted a request recently. Please wait before submitting another." },
        { status: 429 }
      );
    }

    // Save to database
    const estimateRequest = await prisma.estimateRequest.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: phone || null,
        propertyType,
        address: sanitizedAddress,
        city: sanitizedCity,
        postalCode: postalCode || null,
        livingArea: livingArea ? parseFloat(livingArea) : null,
        landArea: landArea ? parseFloat(landArea) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        condition: condition || null,
        features: features || [],
        description: sanitizedDescription,
        images: images || [],
      },
    });

    // In production, you would also send an email notification here

    return NextResponse.json(
      { message: "Estimate request submitted successfully", id: estimateRequest.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling estimate request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
