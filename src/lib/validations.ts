/**
 * Shared validation schemas and helpers for API routes.
 */

/** Email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Password requirements */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_REGEX_LETTER = /[A-Za-z]/
export const PASSWORD_REGEX_NUMBER = /[0-9]/

/** Field length limits */
export const MAX_LENGTHS = {
  name: 100,
  email: 255,
  phone: 30,
  title: 200,
  description: 10000,
  message: 5000,
  address: 500,
  city: 100,
  postalCode: 20,
  url: 2048,
  bio: 2000,
  company: 200,
  slug: 200,
} as const

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_LENGTHS.email
}

/** Validate password strength */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }
  }
  if (!PASSWORD_REGEX_LETTER.test(password)) {
    return { valid: false, error: "Password must contain at least one letter" }
  }
  if (!PASSWORD_REGEX_NUMBER.test(password)) {
    return { valid: false, error: "Password must contain at least one number" }
  }
  return { valid: true }
}

/** Validate a string field's length */
export function isWithinLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

/** Validate required fields exist and are non-empty strings */
export function validateRequired(
  fields: Record<string, unknown>,
  requiredKeys: string[]
): { valid: boolean; missing?: string[] } {
  const missing = requiredKeys.filter(
    (key) => !fields[key] || (typeof fields[key] === "string" && !(fields[key] as string).trim())
  )
  return missing.length === 0
    ? { valid: true }
    : { valid: false, missing }
}
