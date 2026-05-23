/**
 * @file r2.ts
 * @description Cloudflare R2 client using the S3-compatible API.
 *              Handles image upload with sharp compression (WebP, max 1200px wide).
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { serverEnv } from "@/lib/env"

// ─────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────

export const r2Client = new S3Client({
  region: "auto",
  endpoint: serverEnv.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: serverEnv.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
    secretAccessKey: serverEnv.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
  },
})

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const MAX_DIMENSION = 1200

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Validates file type and size before uploading. */
export function validateImageFile(
  file: File
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: "File size must be under 5MB" }
  }
  return { valid: true }
}

/**
 * Compresses an image to WebP format, max 1200px wide, and uploads it to R2.
 * Returns the public URL and the R2 object key.
 */
export async function uploadImageToR2(
  file: File,
  folder: string = "products"
): Promise<{ url: string; key: string }> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const compressed = await sharp(buffer)
    .resize({ width: MAX_DIMENSION, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()

  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`

  await r2Client.send(
    new PutObjectCommand({
      Bucket: serverEnv.CLOUDFLARE_R2_BUCKET,
      Key: key,
      Body: compressed,
      ContentType: "image/webp",
    })
  )

  const url = `${serverEnv.CLOUDFLARE_R2_ENDPOINT}/${serverEnv.CLOUDFLARE_R2_BUCKET}/${key}`
  return { url, key }
}

/** Deletes an image from R2 by its object key. */
export async function deleteImageFromR2(key: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: serverEnv.CLOUDFLARE_R2_BUCKET,
      Key: key,
    })
  )
}
