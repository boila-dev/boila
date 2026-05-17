/*
 * build-registry.ts
 *
 * Reads every .mdx file under apps/web/content/{boilerplates,plugins}/,
 * validates the frontmatter against the matching JSON schema, and writes the
 * merged result to apps/web/public/registry.json — the public contract
 * consumed by both the web app (at build time) and the `npx @boila/cli` CLI
 * (at runtime).
 *
 * Modes:
 *   build-registry         → validate + write registry.json
 *   build-registry --check → validate only, exit non-zero on any error
 *
 * The script is the single source of truth for the registry shape. Update
 * the schemas first, then update the MDX files to match.
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join, basename } from "node:path"

import matter from "gray-matter"
// 2020-12 draft requires the `/dist/2020` entrypoint in Ajv 8.
import Ajv from "ajv/dist/2020.js"
import type { ErrorObject, ValidateFunction } from "ajv"
import addFormats from "ajv-formats"

type AnyRecord = Record<string, unknown>

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const BOILERPLATES_DIR = join(ROOT, "apps/web/content/boilerplates")
const PLUGINS_DIR = join(ROOT, "apps/web/content/plugins")
const BOILERPLATE_SCHEMA_PATH = join(ROOT, "registry.schema.json")
const PLUGIN_SCHEMA_PATH = join(ROOT, "plugin.schema.json")
const OUT_PATH = join(ROOT, "apps/web/public/registry.json")

const CHECK_ONLY = process.argv.includes("--check")

async function main() {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)

  const boilerplateSchema = JSON.parse(
    await readFile(BOILERPLATE_SCHEMA_PATH, "utf8")
  ) as AnyRecord
  const pluginSchema = JSON.parse(
    await readFile(PLUGIN_SCHEMA_PATH, "utf8")
  ) as AnyRecord
  const validateBoilerplate = ajv.compile(boilerplateSchema)
  const validatePlugin = ajv.compile(pluginSchema)

  const errors: string[] = []

  const plugins = await loadEntries({
    dir: PLUGINS_DIR,
    label: "plugin",
    validate: validatePlugin,
    errors,
  })
  const boilerplates = await loadEntries({
    dir: BOILERPLATES_DIR,
    label: "boilerplate",
    validate: validateBoilerplate,
    errors,
  })

  if (boilerplates.length === 0) {
    console.error(`[registry] No boilerplate .mdx files found in ${BOILERPLATES_DIR}`)
    process.exit(1)
  }

  // Cross-reference checks: boilerplate plugin slugs must resolve, plugin
  // requires/conflicts must resolve. Catch typos before they ship.
  const pluginSlugs = new Set(plugins.map((p) => String(p.slug)))
  for (const b of boilerplates) {
    for (const list of ["bundledPlugins", "compatiblePlugins"] as const) {
      const refs = (b[list] ?? []) as string[]
      for (const slug of refs) {
        if (!pluginSlugs.has(slug)) {
          errors.push(
            `boilerplates/${b.slug}.mdx: ${list} references unknown plugin "${slug}"`
          )
        }
      }
    }
  }
  for (const p of plugins) {
    for (const list of ["requires", "conflicts"] as const) {
      const refs = (p[list] ?? []) as string[]
      for (const slug of refs) {
        if (!pluginSlugs.has(slug)) {
          errors.push(
            `plugins/${p.slug}.mdx: ${list} references unknown plugin "${slug}"`
          )
        }
        if (slug === p.slug) {
          errors.push(`plugins/${p.slug}.mdx: ${list} cannot reference self`)
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(
      `[registry] ${errors.length} invalid entr${errors.length === 1 ? "y" : "ies"}:\n\n` +
        errors.join("\n\n")
    )
    process.exit(1)
  }

  boilerplates.sort(byAddedAtDesc)
  plugins.sort(byAddedAtDesc)

  const payload = {
    $schema: "https://boila.dev/registry.schema.json",
    version: 2,
    generatedAt: new Date().toISOString(),
    counts: {
      boilerplates: boilerplates.length,
      plugins: plugins.length,
    },
    boilerplates,
    plugins,
  }

  if (CHECK_ONLY) {
    console.log(
      `[registry] ✓ ${boilerplates.length} boilerplate${boilerplates.length === 1 ? "" : "s"} + ${plugins.length} plugin${plugins.length === 1 ? "" : "s"} valid (check-only, nothing written)`
    )
    return
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8")
  console.log(
    `[registry] ✓ ${boilerplates.length} boilerplate${boilerplates.length === 1 ? "" : "s"} + ${plugins.length} plugin${plugins.length === 1 ? "" : "s"} → ${OUT_PATH.replace(ROOT + "/", "")}`
  )
}

async function loadEntries(opts: {
  dir: string
  label: "boilerplate" | "plugin"
  validate: ValidateFunction
  errors: string[]
}): Promise<AnyRecord[]> {
  const { dir, label, validate, errors } = opts

  // Plugins directory may not exist yet on first run — treat as empty.
  try {
    await stat(dir)
  } catch {
    return []
  }

  const files = (await readdir(dir)).filter((f) => f.endsWith(".mdx")).sort()
  const out: AnyRecord[] = []
  const slugs = new Set<string>()

  for (const file of files) {
    const path = join(dir, file)
    const raw = await readFile(path, "utf8")
    const { data: frontmatter } = matter(raw)

    if (frontmatter.addedAt instanceof Date) {
      frontmatter.addedAt = frontmatter.addedAt.toISOString().slice(0, 10)
    }

    if (!validate(frontmatter)) {
      errors.push(
        `${label}s/${file}\n${formatAjvErrors(validate.errors ?? [])}`
      )
      continue
    }

    const slug = String(frontmatter.slug)
    const expectedSlug = basename(file, ".mdx")
    if (slug !== expectedSlug) {
      errors.push(
        `${label}s/${file}: slug "${slug}" does not match filename "${expectedSlug}"`
      )
      continue
    }
    if (slugs.has(slug)) {
      errors.push(`${label}s/${file}: duplicate slug "${slug}"`)
      continue
    }
    slugs.add(slug)

    out.push(frontmatter)
  }

  return out
}

function byAddedAtDesc(a: AnyRecord, b: AnyRecord): number {
  const da = String(a.addedAt ?? "")
  const db = String(b.addedAt ?? "")
  return db.localeCompare(da)
}

function formatAjvErrors(errs: ErrorObject[]): string {
  return errs
    .map((e) => {
      const where = e.instancePath || "/"
      return `  - ${where} ${e.message ?? ""}${
        e.params ? ` (${JSON.stringify(e.params)})` : ""
      }`
    })
    .join("\n")
}

main().catch((err) => {
  console.error("[registry] fatal:", err)
  process.exit(1)
})
