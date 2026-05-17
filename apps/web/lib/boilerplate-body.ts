/*
 * Server-only reader for the raw MDX body of a boilerplate entry.
 *
 * The detail page calls this to render the markdown body via react-markdown.
 * Kept in a separate module from `./boilerplates.ts` because that one is
 * imported from client components — pulling `fs` in there would break the
 * bundler. The frontmatter still lives in the client-safe `BOILERPLATES`
 * array (read from registry.json at build time).
 */
import "server-only"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import matter from "gray-matter"

const CONTENT_DIR = join(process.cwd(), "content/boilerplates")

export function getBoilerplateBody(slug: string): string | null {
  try {
    const raw = readFileSync(join(CONTENT_DIR, `${slug}.mdx`), "utf8")
    return matter(raw).content.trim()
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null
    throw err
  }
}
