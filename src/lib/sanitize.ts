/**
 * Basic XSS sanitization utilities.
 * For comprehensive sanitization, consider adding DOMPurify (server-side: isomorphic-dompurify).
 */

/** Escape HTML special characters to prevent XSS */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char)
}

/** Strip all HTML tags from a string */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "")
}

/** Sanitize a string for safe database storage and display */
export function sanitizeInput(str: string): string {
  return stripHtml(str).trim()
}

/** Sanitize an object's string values */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      ;(sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string)
    }
  }
  return sanitized
}

/** Validate and sanitize email */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") return ""
  return email.toLowerCase().trim()
}

/** Validate and sanitize phone number (keep only digits, +, spaces, hyphens, parens) */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\s\-()]/g, "").trim()
}
