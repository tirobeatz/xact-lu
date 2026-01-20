"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string | null
  logo: string | null
  email: string
  phone: string
  address: string | null
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    id: "default",
    siteName: "Xact Real Estate",
    siteDescription: "",
    logo: "",
    email: "info@xact.lu",
    phone: "+352 621 000 000",
    address: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        if (data.logo) setLogoPreview(data.logo)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, logo: data.url }))
      }
    } catch (error) {
      console.error("Failed to upload logo:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8926A]" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Site Settings</h1>
        <p className="text-[#6B6B6B] mt-1">Manage your website settings and branding</p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding Section */}
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">Branding</h2>

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Site Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-[#F5F3EF] border-2 border-dashed border-[#E8E6E3] flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-4 py-2 bg-[#F5F3EF] text-[#1A1A1A] rounded-lg text-sm font-medium hover:bg-[#E8E6E3] transition-colors">
                    Upload Logo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-[#6B6B6B] mt-2">
                  Recommended: SVG or PNG, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Site Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E6E3] focus:outline-none focus:ring-2 focus:ring-[#B8926A]/20 focus:border-[#B8926A]"
              placeholder="Your site name"
            />
          </div>

          {/* Site Description */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription || ""}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E6E3] focus:outline-none focus:ring-2 focus:ring-[#B8926A]/20 focus:border-[#B8926A] resize-none"
              placeholder="A brief description of your website"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">Contact Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E6E3] focus:outline-none focus:ring-2 focus:ring-[#B8926A]/20 focus:border-[#B8926A]"
                placeholder="contact@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E6E3] focus:outline-none focus:ring-2 focus:ring-[#B8926A]/20 focus:border-[#B8926A]"
                placeholder="+352 000 000 000"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Office Address
            </label>
            <textarea
              value={settings.address || ""}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E6E3] focus:outline-none focus:ring-2 focus:ring-[#B8926A]/20 focus:border-[#B8926A] resize-none"
              placeholder="Your office address"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 px-8 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
