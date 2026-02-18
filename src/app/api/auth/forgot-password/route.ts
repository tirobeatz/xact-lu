import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"
import { sanitizeEmail } from "@/lib/sanitize"
import { sendPasswordResetEmail } from "@/lib/email"
import { randomBytes } from "node:crypto"

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`forgot-password:${ip}`, RATE_LIMITS.auth)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const body = await req.json()
    const { email } = body

    // Validate required fields
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    // Always return success to prevent email enumeration
    // But only create token if user exists
    if (user) {
      // Generate secure random token
      const token = randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      // Store token in VerificationToken table
      await prisma.verificationToken.create({
        data: {
          identifier: sanitizedEmail,
          token,
          expires,
        },
      })

      // Create reset URL
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(sanitizedEmail)}`

      // Send email
      try {
        await sendPasswordResetEmail(sanitizedEmail, token, resetUrl)
      } catch (emailError) {
        console.error("Email send error:", emailError)
        // Don't fail the request if email fails in production
        if (process.env.NODE_ENV === "development") {
          console.log("[DEV] Reset URL:", resetUrl)
        }
      }
    }

    // Always return the same success message
    return NextResponse.json(
      {
        message: "If an account exists with that email, a password reset link will be sent shortly.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)

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
