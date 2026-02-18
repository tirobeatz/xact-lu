"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        setError(t.auth.somethingWentWrong)
        console.error("Forgot password: Non-JSON response", res.status, res.statusText)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t.auth.somethingWentWrong)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      console.error("Forgot password fetch error:", err)
      setError(t.auth.somethingWentWrong)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
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
          {!submitted ? (
            <>
              <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">{t.auth.forgotPasswordTitle}</h1>
              <p className="text-[#6B6B6B] mb-8">{t.auth.forgotPasswordDescription}</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white font-medium"
                >
                  {loading ? t.auth.sending : t.auth.sendResetLink}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">{t.auth.resetLinkSent}</h2>
                <p className="text-[#6B6B6B] mb-6">{t.auth.resetLinkSentDescription}</p>
              </div>
            </>
          )}
        </div>

        {/* Back to Login Link */}
        <p className="text-center mt-6 text-[#6B6B6B]">
          {t.auth.rememberPassword}{" "}
          <Link href="/login" className="text-[#B8926A] hover:underline font-medium">
            {t.auth.signIn}
          </Link>
        </p>
      </div>
    </div>
  )
}
