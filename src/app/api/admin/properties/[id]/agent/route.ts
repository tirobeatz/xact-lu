import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/admin/properties/[id]/agent - Assign agent to property
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { agentId } = await request.json()

    // agentId can be null to unassign
    const property = await prisma.property.update({
      where: { id },
      data: { agentId: agentId || null },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error("Failed to assign agent:", error)
    return NextResponse.json(
      { error: "Failed to assign agent" },
      { status: 500 }
    )
  }
}
