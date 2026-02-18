import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"
import { sanitizeInput, sanitizeEmail } from "@/lib/sanitize"

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`register:${ip}`, RATE_LIMITS.register)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const body = await req.json()
    const { name, email, password } = body

    // Validate required fields early (before sanitization)
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = name && typeof name === "string" ? sanitizeInput(name) : undefined
    const sanitizedEmail = sanitizeEmail(email)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check for at least one number and one letter
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one letter and one number" },
        { status: 400 }
      )
    }

    // Validate name if provided
    if (sanitizedName && sanitizedName.length > 100) {
      return NextResponse.json(
        { error: "Name is too long" },
        { status: 400 }
      )
    }

    // Check if user already exists (use generic message to prevent email enumeration)
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account. Please try again or use a different email." },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: sanitizedName ?? null,
        email: sanitizedEmail,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint violation (e.g., email already exists)
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Unable to create account. Please try again or use a different email." },
          { status: 400 }
        )
      }
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Prisma initialization error — check DATABASE_URL")
    }

    // In development, include error details for debugging
    const isDev = process.env.NODE_ENV === "development"
    return NextResponse.json(
      {
        error: "Something went wrong",
        ...(isDev && { details: error instanceof Error ? error.message : String(error) }),
      },
      { status: 500 }
    )
  }
}