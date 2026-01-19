import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()

  const updateData: any = {}

  if (data.isVerified !== undefined) {
    updateData.isVerified = data.isVerified
    if (data.isVerified) {
      updateData.verifiedAt = new Date()
    } else {
      updateData.verifiedAt = null
    }
  }

  const agency = await prisma.agency.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(agency)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  // Delete the agency (cascade will handle properties, etc.)
  await prisma.agency.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
