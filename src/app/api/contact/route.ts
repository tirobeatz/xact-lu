import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/contact - Handle contact form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return NextResponse.json({ error: "Field length exceeded" }, { status: 400 });
    }

    if (phone && phone.length > 30) {
      return NextResponse.json({ error: "Phone number too long" }, { status: 400 });
    }

    // Rate limiting - check for recent submissions from same email
    const recentSubmission = await prisma.contactSubmission.findFirst({
      where: {
        email,
        createdAt: { gte: new Date(Date.now() - 300000) }, // Last 5 minutes
      },
    });

    if (recentSubmission) {
      return NextResponse.json(
        { error: "Please wait before sending another message" },
        { status: 429 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        inquiryType: inquiryType || "general",
        message,
      },
    });

    // In production, you would also send an email notification here
    // using a service like SendGrid, Resend, or AWS SES

    return NextResponse.json(
      { message: "Message sent successfully", id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
