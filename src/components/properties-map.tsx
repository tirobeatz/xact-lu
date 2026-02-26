"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProperty {
  id: string
  title: string
  slug: string
  location: string
  price: number
  type: string
  listingType: string
  beds: number
  area: number
  image: string
  latitude: number | null
  longitude: number | null
}

interface PropertiesMapProps {
  properties: MapProperty[]
  formatPrice: (price: number) => string
}

export default function PropertiesMap({ properties, formatPrice }: PropertiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Clean up previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Filter properties with valid coordinates
    const mappableProperties = properties.filter(
      (p) => p.latitude && p.longitude
    )

    // Default center: Luxembourg City
    const defaultCenter: [number, number] = [49.6117, 6.1319]
    const center = mappableProperties.length > 0
      ? [mappableProperties[0].latitude!, mappableProperties[0].longitude!] as [number, number]
      : defaultCenter

    const map = L.map(mapRef.current, {
      center,
      zoom: mappableProperties.length > 1 ? 10 : 14,
      scrollWheelZoom: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add markers for each property
    const markers: L.Marker[] = []
    mappableProperties.forEach((property) => {
      const icon = L.divIcon({
        className: "custom-listing-marker",
        html: `<div style="
          background: ${property.listingType === "RENT" ? "#3B82F6" : "#B8926A"};
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
          cursor: pointer;
          font-family: system-ui, sans-serif;
        ">${formatPrice(property.price)}</div>`,
        iconSize: [0, 0],
        iconAnchor: [40, 15],
        popupAnchor: [0, -15],
      })

      const marker = L.marker(
        [property.latitude!, property.longitude!],
        { icon }
      ).addTo(map)

      const popupContent = `
        <a href="/properties/${property.slug}" style="text-decoration: none; color: inherit; display: block; width: 220px; font-family: system-ui, sans-serif;">
          <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 14px; font-weight: 600; color: #1A1A1A; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${property.title}</div>
          <div style="font-size: 12px; color: #6B6B6B; margin-bottom: 4px;">${property.location}</div>
          <div style="font-size: 14px; font-weight: 700; color: #B8926A;">${formatPrice(property.price)}${property.listingType === "RENT" ? "/mo" : ""}</div>
          <div style="font-size: 11px; color: #6B6B6B; margin-top: 4px;">${property.beds > 0 ? property.beds + " beds · " : ""}${property.area} m²</div>
        </a>
      `

      marker.bindPopup(popupContent, { maxWidth: 240, className: "property-popup" })
      markers.push(marker)
    })

    // Fit bounds to show all markers
    if (markers.length > 1) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    // Show message if no properties have coordinates
    if (mappableProperties.length === 0) {
      L.popup()
        .setLatLng(defaultCenter)
        .setContent('<div style="font-family: system-ui, sans-serif; text-align: center; padding: 8px;"><strong>No location data available</strong><br><small>Properties will appear here once coordinates are added</small></div>')
        .openOn(map)
    }

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [properties, formatPrice])

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden z-0"
      style={{ isolation: "isolate" }}
    />
  )
}
