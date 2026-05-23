/**
 * @file drizzle.config.ts
 * @description Drizzle Kit configuration for schema generation and migrations.
 *              Run `npm run db:generate` to generate migrations from schema changes.
 *              Run `npm run db:migrate` to apply migrations to Neon PostgreSQL.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import type { Config } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env.local" })

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config
