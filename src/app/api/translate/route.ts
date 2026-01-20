import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// MyMemory Translation API - free, no API key needed, 5000 chars/day limit
// https://mymemory.translated.net/doc/spec.php
// Note: Max 500 chars per request for anonymous users

async function translateChunk(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === "") return ""

  try {
    const langPair = `${sourceLang}|${targetLang}`
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()

      // Check if translation was successful
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText

        // MyMemory sometimes returns the original text in uppercase if it fails
        if (translated.toUpperCase() !== text.toUpperCase()) {
          return translated
        }
      }

      // Check for quota exceeded
      if (data.responseStatus === 429 || data.responseDetails?.includes("LIMIT")) {
        console.warn("MyMemory daily limit reached")
        return text
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error(`MyMemory translation failed: ${errorMessage}`)
  }

  return text
}

async function translateWithMyMemory(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === "") return ""

  console.log(`MyMemory translation: ${sourceLang} -> ${targetLang}, length: ${text.length} chars`)

  // MyMemory has 500 char limit per request for anonymous users
  const MAX_CHUNK_SIZE = 450

  if (text.length <= MAX_CHUNK_SIZE) {
    const result = await translateChunk(text, sourceLang, targetLang)
    console.log(`Translation successful: "${text.substring(0, 30)}..." -> "${result.substring(0, 30)}..."`)
    return result
  }

  // Split text into chunks at sentence boundaries
  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []
  let currentChunk = ""

  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).length > MAX_CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
      }
      // If a single sentence is too long, split by words
      if (sentence.length > MAX_CHUNK_SIZE) {
        const words = sentence.split(" ")
        currentChunk = ""
        for (const word of words) {
          if ((currentChunk + " " + word).length > MAX_CHUNK_SIZE) {
            if (currentChunk) chunks.push(currentChunk.trim())
            currentChunk = word
          } else {
            currentChunk = currentChunk ? currentChunk + " " + word : word
          }
        }
      } else {
        currentChunk = sentence
      }
    } else {
      currentChunk = currentChunk ? currentChunk + " " + sentence : sentence
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  console.log(`Splitting into ${chunks.length} chunks for translation`)

  // Translate each chunk
  const translatedChunks: string[] = []
  for (const chunk of chunks) {
    const translated = await translateChunk(chunk, sourceLang, targetLang)
    translatedChunks.push(translated)
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  const result = translatedChunks.join(" ")
  console.log(`Translation successful: "${text.substring(0, 30)}..." -> "${result.substring(0, 30)}..."`)
  return result
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Allow any logged-in user to translate
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { text, sourceLang, targetLangs } = body

    if (!text || !sourceLang || !targetLangs || !Array.isArray(targetLangs)) {
      return NextResponse.json(
        { error: "Missing required fields: text, sourceLang, targetLangs" },
        { status: 400 }
      )
    }

    console.log(`Translation request: "${text.substring(0, 50)}..." from ${sourceLang} to ${targetLangs.join(", ")}`)

    const translations: Record<string, string> = {
      [sourceLang]: text, // Include original text
    }

    // Translate to each target language
    for (const targetLang of targetLangs) {
      if (targetLang !== sourceLang) {
        const translated = await translateWithMyMemory(text, sourceLang, targetLang)
        translations[targetLang] = translated

        // Small delay between requests to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    // Check if any translation actually happened
    const translationSucceeded = Object.entries(translations).some(
      ([lang, translatedText]) => lang !== sourceLang && translatedText !== text
    )

    if (!translationSucceeded) {
      console.warn("Translation may have failed - all translations are same as source")
    }

    return NextResponse.json({
      translations,
      warning: !translationSucceeded ? "Translation service may be unavailable. You can enter translations manually." : undefined
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    )
  }
}
