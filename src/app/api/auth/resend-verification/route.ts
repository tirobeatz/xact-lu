import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"
import { randomBytes } from "node:crypto"

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`resend-verification:${ip}`, RATE_LIMITS.auth)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if already verified
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { emailVerified: true },
    })

    if (user?.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 200 }
      )
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: session.user.email },
    })

    // Generate new token (24-hour expiry for verification)
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: session.user.email,
        token,
        expires,
      },
    })

    // Create verification URL
    const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(session.user.email)}`

    // Send email
    try {
      await sendVerificationEmail(session.user.email, verifyUrl)
    } catch (emailError) {
      console.error("Verification email send error:", emailError)
      if (process.env.NODE_ENV === "development") {
        console.log("[DEV] Verify URL:", verifyUrl)
      }
    }

    return NextResponse.json(
      { message: "Verification email sent." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
