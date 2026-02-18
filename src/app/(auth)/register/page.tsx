"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function RegisterPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError(t.auth.passwordsNotMatch)
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t.auth.passwordTooShort)
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      // Handle non-JSON responses (e.g., server error pages)
      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        setError(t.auth.somethingWentWrong)
        console.error("Registration: Non-JSON response", res.status, res.statusText)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        // In development, show detailed error if available
        const detail = data.details ? ` (${data.details})` : ""
        setError((data.error || t.auth.somethingWentWrong) + detail)
      } else {
        router.push("/login?registered=true")
      }
    } catch (err) {
      console.error("Registration fetch error:", err)
      setError(t.auth.somethingWentWrong)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
              <span className="text-xl font-bold text-white">X</span>
            </div>
            <span className="text-2xl font-semibold text-[#1A1A1A]">Xact</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E8E6E3] p-8">
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">{t.auth.createAccount}</h1>
          <p className="text-[#6B6B6B] mb-8">{t.auth.startJourney}</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t.auth.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t.auth.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t.auth.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">{t.auth.atLeast8Chars}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t.auth.confirmPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="w-4 h-4 mt-1 rounded border-[#E8E6E3]" required />
              <span className="text-sm text-[#6B6B6B]">
                {t.auth.agreeToTerms}{" "}
                <Link href="/legal/terms" className="text-[#B8926A] hover:underline">
                  {t.auth.termsOfService}
                </Link>{" "}
                {t.auth.and}{" "}
                <Link href="/legal/privacy" className="text-[#B8926A] hover:underline">
                  {t.auth.privacyPolicy}
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white font-medium"
            >
              {loading ? t.auth.creatingAccount : t.auth.createAccount}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-[#6B6B6B]">
          {t.auth.alreadyHaveAccount}{" "}
          <Link href="/login" className="text-[#B8926A] hover:underline font-medium">
            {t.auth.signInLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
