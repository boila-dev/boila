/*
 * Server-side Better Auth instance. Wired with:
 *   - Drizzle SQLite adapter (zero-config local dev)
 *   - Email + password authentication
 *
 * Add OAuth providers under `socialProviders`, or enable email verification
 * by setting `emailAndPassword.requireEmailVerification: true` and wiring
 * a transactional email plugin.
 */
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})

export type Session = typeof auth.$Infer.Session
