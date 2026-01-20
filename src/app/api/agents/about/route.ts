import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/agents/about - Get agents to display on About page
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      where: {
        isActive: true,
        showOnAbout: true,
      },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        bio: true,
        role: true,
      },
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error("Failed to fetch about page agents:", error)
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}
