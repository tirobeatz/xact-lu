"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useI18n } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

export function EmailVerificationBanner() {
  const { data: session } = useSession()
  const { t } = useI18n()
  const { toast } = useToast()
  const [sending, setSending] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if user is verified or not logged in
  if (!session?.user || session.user.emailVerified || dismissed) {
    return null
  }

  const handleResend = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      })

      if (res.ok) {
        toast({
          title: t.auth?.verificationSent || "Verification email sent",
          description: t.auth?.verificationSentDesc || "Check your inbox for the verification link.",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send verification email. Please try again.",
          variant: "error",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-amber-800">
          {t.auth?.verifyEmailBanner || "Please verify your email address."}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleResend}
          disabled={sending}
          className="text-sm font-medium text-amber-700 hover:text-amber-900 underline disabled:opacity-50"
        >
          {sending ? "..." : (t.auth?.resendVerification || "Resend verification email")}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
