"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

export default function PropertyMap({ latitude, longitude, title, address }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      scrollWheelZoom: false,
    })

    // CartoDB Positron — clean, modern, light tile style
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 20,
      subdomains: "abcd",
    }).addTo(map)

    // Custom marker icon matching brand colors
    const icon = L.divIcon({
      className: "xact-pin-marker",
      html: `<div style="
        width: 36px;
        height: 36px;
        background: #B8926A;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    })

    // Add marker with popup
    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: system-ui, sans-serif; padding: 4px;">
          <strong style="font-size: 14px;">${title}</strong>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0;">${address}</p>
        </div>`,
        { maxWidth: 250 }
      )

    mapInstanceRef.current = map

    // Cleanup
    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [latitude, longitude, title, address])

  return (
    <>
      <style>{`
        .xact-pin-marker {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <div
        ref={mapRef}
        className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden z-0"
        style={{ isolation: "isolate" }}
      />
    </>
  )
}
