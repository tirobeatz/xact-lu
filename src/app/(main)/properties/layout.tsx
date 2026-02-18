import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse premium real estate listings in Luxembourg. Find apartments, houses, villas, and commercial properties for sale and rent.",
}

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
