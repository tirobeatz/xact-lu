"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { motion } from "framer-motion"

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  image: string | null
  bio: string | null
  company: string | null
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
}

export default function ProfilePage() {
  const { t } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    bio: "",
    image: "",
    notifications: {
      email: true,
      sms: false,
      marketing: false,
    },
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user")
      if (!response.ok) throw new Error("Failed to fetch profile")
      const data: UserProfile = await response.json()
      setFormData({
        name: data.name || "",
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        bio: data.bio || "",
        image: data.image || "",
        notifications: {
          email: data.emailNotifications,
          sms: data.smsNotifications,
          marketing: data.marketingEmails,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8926A]" />
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleNotificationChange = (key: keyof typeof formData.notifications) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
      },
    })
    setSaved(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB")
      return
    }

    setUploadingImage(true)
    setError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("files", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const uploadResult = await uploadResponse.json()
      const imageUrl = uploadResult.urls[0]

      // Update form data with new image URL
      setFormData({ ...formData, image: imageUrl })
      setSaved(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          bio: formData.bio,
          image: formData.image || null,
          emailNotifications: formData.notifications.email,
          smsNotifications: formData.notifications.sms,
          marketingEmails: formData.notifications.marketing,
        }),
      })

      if (!response.ok) throw new Error("Failed to save profile")
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold text-white">
            {t.dashboard.profile?.title || "Profile Settings"}
          </h1>
          <p className="text-white/60 mt-1">
            {t.dashboard.profile?.subtitle || "Manage your account information"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="max-w-2xl mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8E6E3] p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
              {t.dashboard.profile?.photo || "Profile Photo"}
            </h2>
            <div className="flex items-center gap-6">
              {formData.image ? (
                <div
                  className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-[#E8E6E3]"
                  style={{ backgroundImage: `url('${formData.image}')` }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#B8926A] flex items-center justify-center text-white text-2xl font-semibold">
                  {formData.name?.charAt(0) || formData.email?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <span className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-[#E8E6E3] bg-white hover:bg-[#F5F3EF] transition-colors text-sm font-medium">
                    {uploadingImage ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-[#B8926A] border-t-transparent rounded-full" />
                        Uploading...
                      </>
                    ) : (
                      t.dashboard.profile?.changePhoto || "Change Photo"
                    )}
                  </span>
                </label>
                <p className="text-xs text-[#6B6B6B] mt-2">
                  JPG, PNG. Max 2MB
                </p>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: "" })
                      setSaved(false)
                    }}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#E8E6E3] p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
              {t.dashboard.profile?.personalInfo || "Personal Information"}
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {t.dashboard.profile?.fullName || "Full Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {t.dashboard.profile?.email || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-[#F5F3EF] text-[#6B6B6B] outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {t.dashboard.profile?.phone || "Phone"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+352 621 123 456"
                    className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {t.dashboard.profile?.company || "Company"} <span className="text-[#6B6B6B] font-normal">({t.common?.optional || "optional"})</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  {t.dashboard.profile?.bio || "Bio"}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t.dashboard.profile?.bioPlaceholder || "Tell us a bit about yourself..."}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none placeholder:text-[#999]"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E8E6E3] p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
              {t.dashboard.profile?.notifications || "Notifications"}
            </h2>
            <div className="space-y-4">
              {[
                { key: "email" as const, label: t.dashboard.profile?.emailNotifications || "Email notifications", desc: t.dashboard.profile?.emailNotificationsDesc || "Receive updates about your listings and inquiries" },
                { key: "sms" as const, label: t.dashboard.profile?.smsNotifications || "SMS notifications", desc: t.dashboard.profile?.smsNotificationsDesc || "Get text messages for urgent updates" },
                { key: "marketing" as const, label: t.dashboard.profile?.marketingEmails || "Marketing emails", desc: t.dashboard.profile?.marketingEmailsDesc || "Receive tips, trends, and promotional content" },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{item.label}</p>
                    <p className="text-sm text-[#6B6B6B]">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationChange(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      formData.notifications[item.key] ? "bg-[#B8926A]" : "bg-[#E8E6E3]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        formData.notifications[item.key] ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-[#E8E6E3] p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
              {t.dashboard.profile?.security || "Security"}
            </h2>
            <Button type="button" variant="outline" className="h-10 px-4 rounded-lg border-[#E8E6E3]">
              {t.dashboard.profile?.changePassword || "Change Password"}
            </Button>
          </motion.div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white disabled:opacity-50"
            >
              {saving ? (t.dashboard.profile?.saving || "Saving...") : (t.dashboard.profile?.saveChanges || "Save Changes")}
            </Button>
            {saved && (
              <span className="text-green-600 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.dashboard.profile?.saved || "Changes saved"}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
