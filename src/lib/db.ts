/**
 * @file db.ts
 * @description Neon PostgreSQL connection via Drizzle ORM.
 *              Uses the serverless HTTP driver — zero idle connections.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema"
import { serverEnv } from "@/lib/env"

/** Drizzle database client — import this in all route handlers. */
export const db = drizzle(neon(serverEnv.DATABASE_URL), { schema })
