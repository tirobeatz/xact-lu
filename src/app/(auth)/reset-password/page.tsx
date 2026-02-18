"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function ResetPasswordPage() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)

  useEffect(() => {
    if (!token || !email) {
      setInvalidToken(true)
    }
  }, [token, email])

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

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError(t.auth.passwordNeedsLetterAndNumber)
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      })

      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        setError(t.auth.somethingWentWrong)
        console.error("Reset password: Non-JSON response", res.status, res.statusText)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t.auth.somethingWentWrong)
      } else {
        setSubmitted(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      console.error("Reset password fetch error:", err)
      setError(t.auth.somethingWentWrong)
    } finally {
      setLoading(false)
    }
  }

  if (invalidToken) {
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
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">{t.auth.invalidOrExpiredToken}</h2>
              <p className="text-[#6B6B6B] mb-6">{t.auth.resetLinkSentDescription}</p>
            </div>
          </div>

          <p className="text-center mt-6 text-[#6B6B6B]">
            <Link href="/forgot-password" className="text-[#B8926A] hover:underline font-medium">
              {t.auth.sendResetLink}
            </Link>
          </p>
        </div>
      </div>
    )
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
          {!submitted ? (
            <>
              <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">{t.auth.resetPasswordTitle}</h1>
              <p className="text-[#6B6B6B] mb-8">{t.auth.resetPasswordDescription}</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {t.auth.newPassword}
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
                    {t.auth.confirmNewPassword}
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white font-medium"
                >
                  {loading ? t.auth.resetting : t.auth.resetPassword}
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
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">{t.auth.passwordResetSuccess}</h2>
                <p className="text-[#6B6B6B] mb-6">{t.auth.passwordResetSuccessDescription}</p>
              </div>
            </>
          )}
        </div>

        {/* Back to Login Link */}
        {!submitted && (
          <p className="text-center mt-6 text-[#6B6B6B]">
            {t.auth.rememberPassword}{" "}
            <Link href="/login" className="text-[#B8926A] hover:underline font-medium">
              {t.auth.signIn}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
