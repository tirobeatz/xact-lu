"use client"

import { useI18n } from "@/lib/i18n"

interface LegalPageHeaderProps {
  /** i18n key under t.legal (e.g., "privacy", "terms", "cookies", "imprint") */
  section: "privacy" | "terms" | "cookies" | "imprint"
  /** Fallback title if i18n key is not found */
  fallbackTitle: string
  /** Fallback subtitle if i18n key is not found */
  fallbackSubtitle?: string
}

export default function LegalPageHeader({ section, fallbackTitle, fallbackSubtitle }: LegalPageHeaderProps) {
  const { t } = useI18n()
  const legalSection = t.legal?.[section]

  return (
    <div className="bg-[#1A1A1A] pt-28 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          {legalSection?.title || fallbackTitle}
        </h1>
        <p className="text-white/60 mt-2">
          {fallbackSubtitle
            ? (legalSection?.subtitle || fallbackSubtitle)
            : `${legalSection?.lastUpdated || "Last updated"}: January 2026`
          }
        </p>
      </div>
    </div>
  )
}
