import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"
import { sanitizeEmail } from "@/lib/sanitize"

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`reset-password:${ip}`, RATE_LIMITS.auth)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const body = await req.json()
    const { email, token, password } = body

    // Validate required fields
    if (!email || typeof email !== "string" || !token || typeof token !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Look up verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    })

    // Check if token exists and is valid
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify token belongs to this email
    if (verificationToken.identifier !== sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        password: hashedPassword,
      },
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json(
      { message: "Password reset successfully. You can now sign in with your new password." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset password error:", error)

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
