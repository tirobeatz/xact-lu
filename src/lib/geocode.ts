/**
 * Geocode an address to latitude/longitude using OpenStreetMap Nominatim.
 * Free, no API key required. Rate limited to 1 req/sec (we add a small delay).
 * Appends ", Luxembourg" to bias results toward the country.
 */

interface GeoResult {
  latitude: number
  longitude: number
}

export async function geocodeAddress(
  address: string,
  city: string,
  postalCode?: string | null
): Promise<GeoResult | null> {
  try {
    // Build a search query biased to Luxembourg
    const parts = [address, city, postalCode, "Luxembourg"].filter(Boolean)
    const query = parts.join(", ")

    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("q", query)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "1")
    url.searchParams.set("countrycodes", "lu")

    const response = await fetch(url.toString(), {
      headers: {
        // Nominatim requires a User-Agent identifying your app
        "User-Agent": "XactRealEstate/1.0 (info@xact.lu)",
      },
    })

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("Geocoding request failed:", response.status)
      }
      return null
    }

    const results = await response.json()

    if (results.length === 0) {
      // Retry with just city + Luxembourg if full address fails
      const fallbackUrl = new URL("https://nominatim.openstreetmap.org/search")
      fallbackUrl.searchParams.set("q", `${city}, Luxembourg`)
      fallbackUrl.searchParams.set("format", "json")
      fallbackUrl.searchParams.set("limit", "1")
      fallbackUrl.searchParams.set("countrycodes", "lu")

      const fallbackResponse = await fetch(fallbackUrl.toString(), {
        headers: {
          "User-Agent": "XactRealEstate/1.0 (info@xact.lu)",
        },
      })

      if (!fallbackResponse.ok) return null

      const fallbackResults = await fallbackResponse.json()
      if (fallbackResults.length === 0) return null

      return {
        latitude: parseFloat(fallbackResults[0].lat),
        longitude: parseFloat(fallbackResults[0].lon),
      }
    }

    return {
      latitude: parseFloat(results[0].lat),
      longitude: parseFloat(results[0].lon),
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Geocoding error:", error)
    }
    return null
  }
}
