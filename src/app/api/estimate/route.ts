import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/estimate - Handle property estimation requests
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!name || !email || !propertyType || !address || !city) {
      return NextResponse.json(
        { error: "Name, email, property type, address, and city are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 255 || address.length > 300) {
      return NextResponse.json({ error: "Field length exceeded" }, { status: 400 });
    }

    // Rate limiting - check for recent submissions from same email
    const recentSubmission = await prisma.estimateRequest.findFirst({
      where: {
        email,
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
        name,
        email,
        phone: phone || null,
        propertyType,
        address,
        city,
        postalCode: postalCode || null,
        livingArea: livingArea ? parseFloat(livingArea) : null,
        landArea: landArea ? parseFloat(landArea) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        condition: condition || null,
        features: features || [],
        description: description || null,
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
