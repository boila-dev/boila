/*
 * Server-only reader for the raw MDX body of a plugin entry.
 * Mirrors `./boilerplate-body.ts`.
 */
import "server-only"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import matter from "gray-matter"

const CONTENT_DIR = join(process.cwd(), "content/plugins")

export function getPluginBody(slug: string): string | null {
  try {
    const raw = readFileSync(join(CONTENT_DIR, `${slug}.mdx`), "utf8")
    return matter(raw).content.trim()
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null
    throw err
  }
}
