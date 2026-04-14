import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal",
  description: "Legal information, privacy policy, terms of service, and cookie policy for HNWI Immobilière sàrl (Xact) Luxembourg.",
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
