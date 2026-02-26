import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Property Valuation",
  description: "Get a free, instant estimate of your Luxembourg property value. Our AI-powered tool provides accurate market valuations based on real transaction data.",
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children
}
