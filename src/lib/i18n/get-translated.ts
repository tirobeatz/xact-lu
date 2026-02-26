export interface Translations {
  en?: string
  fr?: string
  de?: string
  [key: string]: string | undefined
}

/**
 * Get a translated value from a translations object, falling back to English then default.
 */
export function getTranslated(
  locale: string,
  defaultValue: string,
  translations?: Translations | null
): string {
  if (!translations || typeof translations !== "object") return defaultValue
  const localeValue = translations[locale]
  if (localeValue && localeValue.trim()) return localeValue
  const enValue = translations.en
  if (enValue && enValue.trim()) return enValue
  return defaultValue
}
