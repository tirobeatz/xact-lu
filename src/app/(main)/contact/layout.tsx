import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Xact Real Estate. Visit our Folschette office, call us, or send a message. We respond within 24 hours.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
