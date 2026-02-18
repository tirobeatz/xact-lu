import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Xact, Luxembourg's trusted real estate platform. Our team, values, and commitment to finding your perfect property.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
