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

  // Prevent admin from demoting themselves
  if (id === session.user.id && data.role && data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot change your own role" },
      { status: 400 }
    )
  }

  const updateData: any = {}

  if (data.role !== undefined) {
    updateData.role = data.role
  }

  if (data.isVerified !== undefined) {
    updateData.isVerified = data.isVerified
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(user)
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

  // Prevent admin from deleting themselves
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    )
  }

  await prisma.user.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
