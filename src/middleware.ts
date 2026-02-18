import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Helper function to add security headers to a response
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://randomuser.me",
      "connect-src 'self' https://*.supabase.co https://api.mymemory.translated.net https://accounts.google.com",
      "form-action 'self'",
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
    ].join("; ")
  )
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware entirely for NextAuth API routes — NextAuth manages its own
  // CSRF tokens, cookies, and redirects. Applying CSP or running getToken()
  // on these routes can break the auth flow.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })

  // Admin routes - require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const response = NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url))
      return addSecurityHeaders(response)
    }

    if (token.role !== "ADMIN") {
      const response = NextResponse.redirect(new URL("/", request.url))
      return addSecurityHeaders(response)
    }
  }

  // Dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const response = NextResponse.redirect(new URL("/login?callbackUrl=/dashboard", request.url))
      return addSecurityHeaders(response)
    }
  }

  // API admin routes - require ADMIN role
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addSecurityHeaders(response)
    }

    if (token.role !== "ADMIN") {
      const response = NextResponse.json({ error: "Forbidden" }, { status: 403 })
      return addSecurityHeaders(response)
    }
  }

  // Auth pages — if already logged in, redirect away from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/dashboard"
      const response = NextResponse.redirect(new URL(callbackUrl, request.url))
      return addSecurityHeaders(response)
    }
  }

  // All other matching routes - add headers and continue
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
