"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { motion } from "framer-motion"

interface Message {
  id: string
  content: string
  fromName: string
  fromEmail: string
  fromPhone: string | null
  isRead: boolean
  createdAt: string
  property: {
    id: string
    title: string
    slug: string
    address: string
  }
}

export default function MessagesPage() {
  const { t } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages()
    }
  }, [status])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/messages")
      if (!response.ok) throw new Error("Failed to fetch messages")
      const data = await response.json()
      setMessages(data)
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

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      // Mark as read
      try {
        await fetch(`/api/user/messages/${message.id}`, {
          method: "PATCH",
        })
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m))
      } catch (err) {
        console.error("Failed to mark message as read:", err)
      }
    }
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return
    // In a real app, this would send an email reply
    alert(t.dashboard.messages?.replySent || "Reply sent!")
    setReplyText("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return t.dashboard.messages?.yesterday || "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-white">
              {t.dashboard.messages?.title || "Messages"}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-[#B8926A] text-white text-sm font-medium">
                {unreadCount} {t.dashboard.messages?.new || "new"}
              </span>
            )}
          </div>
          <p className="text-white/60 mt-1">
            {t.dashboard.messages?.subtitle || "Property inquiries from interested buyers"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {messages.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-2">
              {messages.map((message, index) => (
                <motion.button
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedMessage?.id === message.id
                      ? "bg-[#B8926A]/10 border-[#B8926A]"
                      : message.isRead
                      ? "bg-white border-[#E8E6E3] hover:border-[#B8926A]/50"
                      : "bg-white border-[#E8E6E3] hover:border-[#B8926A]/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#B8926A] flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {message.fromName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-medium truncate ${!message.isRead ? "text-[#1A1A1A]" : "text-[#6B6B6B]"}`}>
                          {message.fromName}
                        </span>
                        <span className="text-xs text-[#6B6B6B] flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B6B6B] truncate mt-0.5">
                        {message.property.title}
                      </p>
                      <p className={`text-sm truncate mt-1 ${!message.isRead ? "text-[#1A1A1A] font-medium" : "text-[#6B6B6B]"}`}>
                        {message.content}
                      </p>
                    </div>
                    {!message.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#B8926A] flex-shrink-0 mt-2" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden"
                >
                  {/* Message Header */}
                  <div className="p-6 border-b border-[#E8E6E3]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#B8926A] flex items-center justify-center text-white text-lg font-semibold">
                          {selectedMessage.fromName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1A1A1A]">{selectedMessage.fromName}</h3>
                          <p className="text-sm text-[#6B6B6B]">{selectedMessage.fromEmail}</p>
                          {selectedMessage.fromPhone && (
                            <p className="text-sm text-[#6B6B6B]">{selectedMessage.fromPhone}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-[#6B6B6B]">
                        {new Date(selectedMessage.createdAt).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-[#F5F3EF] rounded-lg">
                      <p className="text-sm text-[#6B6B6B]">
                        {t.dashboard.messages?.regarding || "Regarding"}:
                      </p>
                      <p className="font-medium text-[#1A1A1A]">{selectedMessage.property.title}</p>
                      <p className="text-sm text-[#6B6B6B]">{selectedMessage.property.address}</p>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="p-6">
                    <p className="text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>

                  {/* Reply Box */}
                  <div className="p-6 bg-[#FAFAF8] border-t border-[#E8E6E3]">
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.dashboard.messages?.reply || "Reply"}
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      placeholder={t.dashboard.messages?.replyPlaceholder || "Type your reply..."}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none placeholder:text-[#999]"
                    />
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="h-10 px-6 rounded-lg bg-[#B8926A] hover:bg-[#A6825C] text-white disabled:opacity-50"
                      >
                        {t.dashboard.messages?.sendReply || "Send Reply"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-[#6B6B6B]">
                    {t.dashboard.messages?.selectMessage || "Select a message to view"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              {t.dashboard.messages?.noMessages || "No messages yet"}
            </h3>
            <p className="text-[#6B6B6B]">
              {t.dashboard.messages?.noMessagesDesc || "When buyers contact you about your listings, you'll see their messages here"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
