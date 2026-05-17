/*
 * Scaffold wrappers.
 *
 * - `scaffold` clones a boilerplate's repo into a new directory.
 * - `scaffoldPlugin` clones a plugin's source subdir on top of an existing
 *   project directory. Plugins are drop-in: files are extracted into the
 *   project as-is. Plugin authors are responsible for not colliding with
 *   file paths the base boilerplate already owns.
 *
 * Dev override: when `BOILA_TEMPLATES_DIR` is set, the CLI bypasses giget
 * and copies from a local folder. This lets you iterate on templates inside
 * this monorepo without pushing anything. The layout mirrors `templates/`:
 *
 *   ${BOILA_TEMPLATES_DIR}/<boilerplate-slug>
 *   ${BOILA_TEMPLATES_DIR}/_plugins/<plugin-slug>
 *
 * Production uses giget against the source repo declared in the MDX
 * frontmatter. We only support github, gitlab, bitbucket, and sourcehut —
 * anything else gets a clear error.
 */
import { cp } from "node:fs/promises"
import { existsSync } from "node:fs"
import { isAbsolute, join, resolve as resolvePath } from "node:path"

import { downloadTemplate } from "giget"

import type { Boilerplate, Plugin } from "./types.js"

const HOST_PREFIX: Record<string, string> = {
  "github.com": "github",
  "gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket",
  "git.sr.ht": "sourcehut",
}

export type ScaffoldResult = {
  /** Absolute path to the cloned directory. */
  dir: string
  /** Source description (giget URI or `local:<path>`) for logging. */
  source: string
}

export async function scaffold(
  b: Boilerplate,
  targetDir: string
): Promise<ScaffoldResult> {
  const localDir = localTemplatePath(b.slug)
  if (localDir) {
    await cp(localDir, targetDir, { recursive: true })
    return { dir: targetDir, source: `local:${localDir}` }
  }

  const source = toGigetSource({
    repo: b.repo,
    branch: b.branch,
    subdir: b.subdir,
    label: b.slug,
  })
  const { dir } = await downloadTemplate(source, {
    dir: targetDir,
    forceClean: false,
    install: false,
  })
  return { dir, source }
}

export async function scaffoldPlugin(
  plugin: Plugin,
  targetDir: string
): Promise<ScaffoldResult> {
  const localDir = localTemplatePath(join("_plugins", plugin.slug))
  if (localDir) {
    // `force: true` semantics via `cp`: overwrite existing files. The base
    // boilerplate is already on disk and the plugin layers on top of it.
    await cp(localDir, targetDir, { recursive: true, force: true })
    return { dir: targetDir, source: `local:${localDir}` }
  }

  const source = toGigetSource({
    repo: plugin.source.repo,
    branch: plugin.source.branch,
    subdir: plugin.source.subdir,
    label: plugin.slug,
  })
  const { dir } = await downloadTemplate(source, {
    dir: targetDir,
    force: true,
    install: false,
  })
  return { dir, source }
}

function localTemplatePath(relativeSlug: string): string | null {
  const root = process.env.BOILA_TEMPLATES_DIR?.trim()
  if (!root) return null
  const abs = isAbsolute(root) ? root : resolvePath(process.cwd(), root)
  const candidate = join(abs, relativeSlug)
  if (!existsSync(candidate)) {
    throw new Error(
      `BOILA_TEMPLATES_DIR is set but ${candidate} does not exist.`
    )
  }
  return candidate
}

function toGigetSource(opts: {
  repo: string
  branch?: string
  subdir?: string
  label: string
}): string {
  let url: URL
  try {
    url = new URL(opts.repo)
  } catch {
    throw new Error(`Invalid repo URL for "${opts.label}": ${opts.repo}`)
  }
  const prefix = HOST_PREFIX[url.hostname]
  if (!prefix) {
    throw new Error(
      `Unsupported repo host "${url.hostname}" for "${opts.label}". ` +
        "Boila currently supports github.com, gitlab.com, bitbucket.org, git.sr.ht."
    )
  }
  const path = url.pathname.replace(/^\//, "").replace(/\.git$/, "")
  const [owner, repo] = path.split("/")
  if (!owner || !repo) {
    throw new Error(`Could not parse owner/repo from ${opts.repo}`)
  }
  const subdirPart = opts.subdir
    ? `/${opts.subdir.replace(/^\/|\/$/g, "")}`
    : ""
  const branchPart = opts.branch ? `#${opts.branch}` : ""
  return `${prefix}:${owner}/${repo}${subdirPart}${branchPart}`
}
