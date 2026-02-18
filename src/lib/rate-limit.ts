/**
 * In-memory rate limiter for API routes.
 * For production at scale, replace with Redis-based solution.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number // seconds until reset
}

/**
 * Check rate limit for a given identifier (e.g., IP address, email).
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowSeconds,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }
  return "unknown"
}

// Preset configs for common use cases
export const RATE_LIMITS = {
  auth: { maxRequests: 5, windowSeconds: 60 },         // 5 per minute
  register: { maxRequests: 3, windowSeconds: 300 },     // 3 per 5 minutes
  contact: { maxRequests: 3, windowSeconds: 300 },      // 3 per 5 minutes
  estimate: { maxRequests: 2, windowSeconds: 3600 },    // 2 per hour
  translate: { maxRequests: 10, windowSeconds: 60 },    // 10 per minute
  upload: { maxRequests: 20, windowSeconds: 300 },      // 20 per 5 minutes
  message: { maxRequests: 5, windowSeconds: 60 },       // 5 per minute
  api: { maxRequests: 60, windowSeconds: 60 },          // 60 per minute (general)
} as const
