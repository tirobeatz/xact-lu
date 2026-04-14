import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
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
  const { status } = await request.json()

  const property = await prisma.property.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  })

  revalidatePath("/")
  revalidatePath("/properties")
  revalidatePath("/en")
  revalidatePath("/de")
  revalidatePath("/fr")
  revalidatePath("/en/properties")
  revalidatePath("/de/properties")
  revalidatePath("/fr/properties")
  if (property.slug) {
    revalidatePath(`/properties/${property.slug}`)
    revalidatePath(`/en/properties/${property.slug}`)
    revalidatePath(`/de/properties/${property.slug}`)
    revalidatePath(`/fr/properties/${property.slug}`)
  }

  return NextResponse.json(property)
}