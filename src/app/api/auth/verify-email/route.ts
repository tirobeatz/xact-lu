import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`verify-email:${ip}`, RATE_LIMITS.auth)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      )
    }

    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-verification-link", request.url)
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-verification-link", request.url)
      )
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.redirect(
        new URL("/login?error=verification-link-expired", request.url)
      )
    }

    // Check if the email matches
    if (verificationToken.identifier !== decodeURIComponent(email)) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-verification-link", request.url)
      )
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL("/login?verified=true", request.url)
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(
      new URL("/login?error=verification-failed", request.url)
    )
  }
}
