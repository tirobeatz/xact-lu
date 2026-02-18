import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Xact Real Estate Luxembourg. Contact our team for property inquiries, valuations, and real estate services.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
