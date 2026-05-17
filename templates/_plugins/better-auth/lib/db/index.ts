/*
 * Drizzle client backed by better-sqlite3.
 *
 * The DB file is written next to the project at ./sqlite.db. It's gitignored
 * by default — push the schema with `pnpm drizzle-kit push` and you're up.
 *
 * To switch to Postgres or MySQL later: swap the driver here, update
 * drizzle.config.ts, and change the `provider` in lib/auth.ts.
 */
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as schema from "./schema"

const sqlite = new Database(process.env.DATABASE_FILE ?? "sqlite.db")
sqlite.pragma("journal_mode = WAL")

export const db = drizzle({ client: sqlite, schema })
