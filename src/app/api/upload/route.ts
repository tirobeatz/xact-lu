import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// Supabase Storage upload
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Magic bytes for image validation (prevents MIME type spoofing)
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  "image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF8
};

function validateMagicBytes(buffer: ArrayBuffer, claimedType: string): boolean {
  const bytes = new Uint8Array(buffer);
  const signatures = MAGIC_BYTES[claimedType];
  if (!signatures) return false;

  return signatures.some((sig) =>
    sig.every((byte, index) => bytes[index] === byte)
  );
}

// Sanitize file extension to prevent path traversal
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function sanitizeExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  return ALLOWED_EXTENSIONS.includes(ext) ? ext : "jpg";
}

// POST /api/upload - Upload images to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`upload:${ip}`, RATE_LIMITS.upload);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error("Supabase credentials not configured");
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Max 10 files per upload
    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files per upload" }, { status: 400 });
    }

    // Validate file types (client-provided MIME type - first check)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only images are allowed.` },
          { status: 400 }
        );
      }

      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 10MB limit" },
          { status: 400 }
        );
      }
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();

      // Server-side magic byte validation (prevents MIME type spoofing)
      if (!validateMagicBytes(bytes, file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" does not match its claimed type. Upload rejected.` },
          { status: 400 }
        );
      }

      // Generate unique filename with sanitized extension
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const extension = sanitizeExtension(file.name);
      // Sanitize user ID for use in file paths (strip any non-alphanumeric chars except hyphens)
      const safeUserId = session.user.id.replace(/[^a-zA-Z0-9\-_]/g, "");
      const filename = `${safeUserId}/${timestamp}-${randomStr}.${extension}`;

      // Upload to Supabase Storage
      const uploadResponse = await fetch(
        `${SUPABASE_URL}/storage/v1/object/property-images/${filename}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": file.type,
          },
          body: bytes,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Supabase upload error:", errorText);
        throw new Error(`Failed to upload ${file.name}`);
      }

      // Return the public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
  }
}
