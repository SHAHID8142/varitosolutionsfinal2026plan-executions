/**
 * @file audit.ts
 * @description Audit log helper — records every significant admin action to the DB.
 *              Call this after every mutation in admin routes.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { db } from "@/lib/db"
import { auditLog } from "@/db/schema"

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────

interface AuditEventParams {
  adminId: string
  action: string
  entityType?: string
  entityId?: string | number
  changes?: { before?: object; after?: object }
  request?: Request
}

/** Inserts an audit log entry. Non-blocking — errors are swallowed to never break the main flow. */
export async function logAuditEvent(params: AuditEventParams) {
  try {
    await db.insert(auditLog).values({
      adminId: params.adminId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId !== undefined ? String(params.entityId) : undefined,
      changes: params.changes as Record<string, unknown>,
      ipAddress: params.request?.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: params.request?.headers.get("user-agent") ?? "unknown",
    })
  } catch {
    // Audit log failure must never crash the primary operation
  }
}
