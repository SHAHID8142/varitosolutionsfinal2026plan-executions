/**
 * @file api/admin/upload/route.ts
 * @description Admin: upload image to Cloudflare R2. Returns the public URL.
 *              Validates file type and size, compresses to WebP via sharp.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { uploadImageToR2, validateImageFile } from "@/lib/r2"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Request must be multipart/form-data", code: "INVALID_CONTENT_TYPE" },
      { status: 400 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data", code: "INVALID_BODY" }, { status: 400 })
  }

  const file = formData.get("file")
  const folder = String(formData.get("folder") ?? "products")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided", code: "MISSING_FILE" }, { status: 400 })
  }

  // Allow only known folders to prevent path traversal
  const allowedFolders = ["products", "categories", "banners", "avatars"]
  if (!allowedFolders.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder", code: "INVALID_FOLDER" }, { status: 400 })
  }

  const validation = validateImageFile(file)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error, code: "INVALID_FILE" }, { status: 400 })
  }

  try {
    const { url, key } = await uploadImageToR2(file, folder)
    return NextResponse.json({ data: { url, key } }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to upload image", code: "UPLOAD_FAILED" },
      { status: 500 }
    )
  }
}
