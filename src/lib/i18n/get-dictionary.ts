import type { Locale } from "./config"

// Import dictionaries
import en from "./dictionaries/en.json"
import de from "./dictionaries/de.json"
import fr from "./dictionaries/fr.json"

const dictionaries = {
  en,
  de,
  fr,
}

export type Dictionary = typeof en

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries.en
}
