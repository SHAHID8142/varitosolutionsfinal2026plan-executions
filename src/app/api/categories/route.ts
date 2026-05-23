/**
 * @file api/categories/route.ts
 * @description Public categories API. Returns the full category tree
 *              (parents with nested children) for use in navigation and filters.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { categories } from "@/db/schema"
import { isNull, asc } from "drizzle-orm"
import { publicApiRatelimit, getClientIp } from "@/lib/ratelimit"
import type { CategoryNode } from "@/types/category"

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const ip = getClientIp(request)
  const { success } = await publicApiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      nameBn: categories.nameBn,
      slug: categories.slug,
      image: categories.image,
      parentId: categories.parentId,
    })
    .from(categories)
    .where(isNull(categories.deletedAt))
    .orderBy(asc(categories.sortOrder), asc(categories.name))

  // Build tree in memory — avoids recursive SQL on small dataset
  const map = new Map<number, CategoryNode & { parentId: number | null }>()

  for (const row of allCategories) {
    map.set(row.id, {
      id: row.id,
      name: row.name,
      nameBn: row.nameBn,
      slug: row.slug,
      image: row.image,
      productCount: 0,
      children: [],
      parentId: row.parentId,
    })
  }

  const roots: CategoryNode[] = []
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  // Strip internal parentId before sending
  const clean = (nodes: (CategoryNode & { parentId?: number | null })[]): CategoryNode[] =>
    nodes.map(({ parentId: _pid, children, ...rest }) => ({
      ...rest,
      children: children ? clean(children) : [],
    }))

  return NextResponse.json({ data: clean(roots) })
}
