import { z } from "zod"

const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional().default(""),
  isFloorplan: z.boolean().optional().default(false),
})

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().min(1, "Description is required"),
  titleTranslations: z.record(z.string()).nullable().optional(),
  descriptionTranslations: z.record(z.string()).nullable().optional(),
  type: z.string().min(1, "Property type is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "RESERVED", "SOLD", "RENTED", "EXPIRED", "ARCHIVED"]),
  listingType: z.enum(["SALE", "RENT"]),
  price: z.number().positive("Price must be positive"),
  charges: z.number().nullable().optional(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  bathrooms: z.number().int().min(0).nullable().optional(),
  rooms: z.number().int().min(0).nullable().optional(),
  livingArea: z.number().min(0).nullable().optional(),
  landArea: z.number().min(0).nullable().optional(),
  floor: z.number().int().nullable().optional(),
  totalFloors: z.number().int().nullable().optional(),
  yearBuilt: z.number().int().nullable().optional(),
  energyClass: z.string().optional().default(""),
  heatingType: z.string().optional().default(""),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().optional().default(""),
  neighborhood: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  agentId: z.string().optional().nullable(),
  images: z.array(imageSchema).default([]),
})

export type PropertyInput = z.infer<typeof propertySchema>
