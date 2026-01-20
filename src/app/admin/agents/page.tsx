"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Agent {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  bio: string | null
  isActive: boolean
  _count: {
    properties: number
  }
}

export default function AdminAgentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    bio: "",
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/")
      } else {
        fetchAgents()
      }
    }
  }, [status, session, router])

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/admin/agents")
      if (res.ok) {
        const data = await res.json()
        setAgents(data)
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB")
      return
    }

    setUploadingImage(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("files", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (res.ok) {
        const data = await res.json()
        setFormData({ ...formData, image: data.urls[0] })
      }
    } catch (error) {
      console.error("Failed to upload image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingAgent
        ? `/api/admin/agents/${editingAgent.id}`
        : "/api/admin/agents"
      const method = editingAgent ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchAgents()
        setShowModal(false)
        setEditingAgent(null)
        setFormData({ name: "", email: "", phone: "", image: "", bio: "" })
      }
    } catch (error) {
      console.error("Failed to save agent:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || "",
      image: agent.image || "",
      bio: agent.bio || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const res = await fetch(`/api/admin/agents/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchAgents()
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    }
  }

  const toggleActive = async (agent: Agent) => {
    try {
      const res = await fetch(`/api/admin/agents/${agent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !agent.isActive }),
      })
      if (res.ok) {
        fetchAgents()
      }
    } catch (error) {
      console.error("Failed to toggle agent status:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8926A]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                <Link href="/admin" className="hover:text-white">Admin</Link>
                <span>/</span>
                <span>Agents</span>
              </div>
              <h1 className="text-3xl font-semibold text-white">
                Manage Agents
              </h1>
              <p className="text-white/60 mt-1">
                Create and manage agents that can be assigned to properties
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingAgent(null)
                setFormData({ name: "", email: "", phone: "", image: "", bio: "" })
                setShowModal(true)
              }}
              className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
            >
              + Add Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {agents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6E3]">
            <div className="w-16 h-16 rounded-full bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No agents yet</h3>
            <p className="text-[#6B6B6B] mb-6">Add your first agent to assign them to properties</p>
            <Button
              onClick={() => setShowModal(true)}
              className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
            >
              + Add Agent
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-[#E8E6E3] p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {agent.image ? (
                    <div
                      className="w-16 h-16 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-[#E8E6E3]"
                      style={{ backgroundImage: `url('${agent.image}')` }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#B8926A] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1A1A1A] truncate">{agent.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${agent.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-[#6B6B6B] truncate">{agent.email}</p>
                    {agent.phone && (
                      <p className="text-sm text-[#6B6B6B]">{agent.phone}</p>
                    )}
                  </div>
                </div>

                {agent.bio && (
                  <p className="text-sm text-[#6B6B6B] mt-4 line-clamp-2">{agent.bio}</p>
                )}

                <div className="mt-4 pt-4 border-t border-[#E8E6E3] flex items-center justify-between">
                  <span className="text-sm text-[#6B6B6B]">
                    {agent._count.properties} {agent._count.properties === 1 ? "property" : "properties"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(agent)}
                      className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                      title={agent.isActive ? "Deactivate" : "Activate"}
                    >
                      <svg className={`w-5 h-5 ${agent.isActive ? "text-green-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(agent)}
                      className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-[#E8E6E3]">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                {editingAgent ? "Edit Agent" : "Add New Agent"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image */}
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div
                    className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-[#E8E6E3]"
                    style={{ backgroundImage: `url('${formData.image}')` }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#B8926A] flex items-center justify-center text-white text-2xl font-semibold">
                    {formData.name?.charAt(0) || "A"}
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
                      {uploadingImage ? "Uploading..." : "Upload Photo"}
                    </span>
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="block text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white outline-none focus:border-[#B8926A]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white outline-none focus:border-[#B8926A]"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+352 621 123 456"
                  className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white outline-none focus:border-[#B8926A]"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white outline-none focus:border-[#B8926A] resize-none"
                  placeholder="A short bio about this agent..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAgent(null)
                  }}
                  className="flex-1 h-11 rounded-xl border-[#E8E6E3]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-11 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white"
                >
                  {saving ? "Saving..." : editingAgent ? "Update Agent" : "Add Agent"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
