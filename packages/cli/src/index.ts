#!/usr/bin/env node
/*
 * `boila` CLI entry point. Dispatches to one of:
 *
 *   boila                          → interactive picker, then scaffold
 *   boila <slug>                   → scaffold known slug into ./<slug>
 *   boila <slug> <dir>             → scaffold into <dir>
 *   boila <slug> --with a,b,c      → non-interactive plugin selection
 *   boila <slug> --bare            → skip plugin prompt, base only
 *   boila search <term>            → print matching boilerplates
 *   boila plugins                  → list available plugins
 *   boila plugins --category auth  → filter the plugin list
 *   boila --help                   → usage
 *   boila --version                → package version
 *
 * Everything resolves through the registry — never hardcoded URLs.
 *
 * The interactive scaffold flow uses @clack/prompts for spinners, boxed
 * intro/outro, and consistent prompts. The non-interactive commands
 * (search, plugins, --help) print plain text so they stay pipe-friendly.
 */
import { resolve } from "node:path"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import {
  cancel,
  intro,
  log,
  note,
  outro,
  spinner,
} from "@clack/prompts"
import color from "picocolors"

import { loadRegistry } from "./registry.js"
import { CANCEL, pickBoilerplate, pickPlugins } from "./picker.js"
import { scaffold, scaffoldPlugin } from "./scaffold.js"
import {
  bundledPlugins,
  compatiblePlugins,
  resolvePluginSelection,
} from "./plugins.js"
import type { Boilerplate, Plugin, Registry } from "./types.js"

const VERSION = "0.0.3"
const BANNER = color.bgCyan(color.black(" boila "))

async function main() {
  const argv = process.argv.slice(2)

  if (argv.includes("--version") || argv.includes("-v")) {
    process.stdout.write(`boila ${VERSION}\n`)
    return
  }
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp()
    return
  }

  if (argv[0] === "search") {
    await commandSearch(argv.slice(1))
    return
  }
  if (argv[0] === "plugins") {
    await commandPlugins(argv.slice(1))
    return
  }

  await commandScaffold(argv)
}

function printHelp() {
  const lines = [
    `${color.bold("boila")} — pick a base, toggle plugins, ship.`,
    "",
    color.bold("Usage"),
    `  ${color.cyan("boila")}                          interactive picker (base then plugins)`,
    `  ${color.cyan("boila <slug>")}                   scaffold into ./<slug> (still prompts for plugins)`,
    `  ${color.cyan("boila <slug> <dir>")}             scaffold into <dir>`,
    `  ${color.cyan("boila <slug> --with a,b,c")}      add the given plugins without prompting`,
    `  ${color.cyan("boila <slug> --bare")}            scaffold base only, no plugin prompt`,
    `  ${color.cyan("boila search <term>")}            list matching boilerplates`,
    `  ${color.cyan("boila plugins")}                  list available plugins`,
    `  ${color.cyan("boila plugins --category auth")}  filter the plugin list`,
    `  ${color.cyan("boila --version")}                print version`,
    "",
    color.bold("Environment"),
    `  ${color.cyan("BOILA_REGISTRY")}                  override the registry URL or file path`,
    `  ${color.cyan("BOILA_TEMPLATES_DIR")}             dev override: copy from a local folder instead of giget`,
    "",
    `Catalog: ${color.underline("https://boila.dev")}`,
  ]
  process.stdout.write(lines.join("\n") + "\n")
}

async function commandSearch(args: string[]) {
  const term = args.join(" ").trim().toLowerCase()
  const reg = await safeLoadRegistry()
  const matches = term
    ? reg.boilerplates.filter((b) =>
        `${b.slug} ${b.name} ${b.description} ${b.stack.join(" ")} ${b.useCases.join(" ")}`
          .toLowerCase()
          .includes(term)
      )
    : reg.boilerplates

  if (matches.length === 0) {
    process.stdout.write(color.dim(`No matches for "${term}".\n`))
    return
  }

  for (const b of matches) {
    process.stdout.write(
      `${color.bold(b.slug)}  ${b.name}\n  ${color.dim(b.description)}\n  ${color.dim(
        `stack: ${b.stack.join(", ")}`
      )}\n\n`
    )
  }
}

async function commandPlugins(args: string[]) {
  const reg = await safeLoadRegistry()
  const plugins = reg.plugins ?? []
  const categoryIdx = args.findIndex((a) => a === "--category" || a === "-c")
  const category =
    categoryIdx >= 0 ? args[categoryIdx + 1]?.toLowerCase() : undefined

  const filtered = category
    ? plugins.filter((p) => p.category === category)
    : plugins

  if (filtered.length === 0) {
    process.stdout.write(
      color.dim(
        category
          ? `No plugins in category "${category}".\n`
          : "No plugins in the registry yet.\n"
      )
    )
    return
  }

  for (const p of filtered) {
    process.stdout.write(
      `${color.bold(p.slug)}  ${p.name}  ${color.dim(`[${p.category}]`)}\n  ${color.dim(p.description)}\n\n`
    )
  }
}

async function commandScaffold(rawArgv: string[]) {
  intro(`${BANNER} ${color.dim(`v${VERSION}`)}`)

  const reg = await safeLoadRegistry()
  const { positionals, withList, bare } = parseScaffoldFlags(rawArgv)

  let slug = positionals[0]
  const targetArg = positionals[1]

  // 1. Pick (or resolve) the boilerplate.
  let entry: Boilerplate | null = null
  if (slug) {
    entry = reg.boilerplates.find((b) => b.slug === slug) ?? null
    if (!entry) {
      log.error(`No boilerplate matches slug "${slug}".`)
      log.info(
        `Try ${color.cyan("boila search " + slug)} for close matches.`
      )
      cancel("Scaffold aborted.")
      process.exit(2)
    }
  } else {
    const picked = await pickBoilerplate(reg.boilerplates)
    if (picked === CANCEL) {
      cancel("Cancelled.")
      process.exit(1)
    }
    entry = picked
    slug = entry.slug
  }

  const dir = resolve(process.cwd(), targetArg ?? slug)
  if (existsSync(dir)) {
    log.error(`Target directory ${color.bold(dir)} already exists.`)
    log.info("Pick a different directory: boila <slug> <dir>")
    cancel("Scaffold aborted.")
    process.exit(1)
  }

  // 2. Plugin selection — fail fast on bad input before any cloning.
  const compat = compatiblePlugins(entry, reg)
  const bundled = bundledPlugins(entry, reg)
  if (bundled.length > 0) {
    log.info(
      `Already in the base: ${bundled.map((p) => color.cyan(p.slug)).join(", ")}`
    )
  }

  let pluginsToApply: Plugin[] = []
  if (bare && withList) {
    log.warn("--bare ignores --with.")
  } else if (!bare && compat.length > 0) {
    pluginsToApply = await choosePlugins({ entry, reg, compat, withList })
  }

  // 3. Clone the base.
  const cloneSpinner = spinner()
  cloneSpinner.start(`Cloning ${color.bold(entry.name)}`)
  try {
    const { source } = await scaffold(entry, dir)
    cloneSpinner.stop(
      `${color.green("✓")} Cloned ${color.bold(entry.name)} ${color.dim(source)}`
    )
  } catch (err) {
    cloneSpinner.stop(`${color.red("✗")} Clone failed`, 1)
    log.error((err as Error).message)
    cancel("Scaffold failed.")
    process.exit(3)
  }

  // 4. Apply each plugin in order.
  for (const plugin of pluginsToApply) {
    const ps = spinner()
    ps.start(`Applying plugin ${color.bold(plugin.slug)}`)
    try {
      const { source } = await scaffoldPlugin(plugin, dir)
      ps.stop(
        `${color.green("✓")} Applied ${color.bold(plugin.slug)} ${color.dim(source)}`
      )
    } catch (err) {
      ps.stop(`${color.red("✗")} Plugin "${plugin.slug}" failed`, 1)
      log.error((err as Error).message)
      log.warn(
        `Base was cloned to ${dir} — fix the plugin and re-apply manually.`
      )
      cancel("Scaffold failed.")
      process.exit(3)
    }
  }

  // 5. Consolidate env vars and print the recap.
  const envAdded = await consolidateEnvExample(dir, entry, pluginsToApply)
  if (envAdded > 0) {
    log.step(
      `Updated .env.example with ${envAdded} new var${envAdded === 1 ? "" : "s"}`
    )
  }

  printRecap(entry, pluginsToApply, dir)

  outro(`Done. Detail: ${color.underline(`https://boila.dev/${entry.slug}`)}`)
}

type ScaffoldFlags = {
  positionals: string[]
  withList: string[] | null
  bare: boolean
}

function parseScaffoldFlags(argv: string[]): ScaffoldFlags {
  const positionals: string[] = []
  let withList: string[] | null = null
  let bare = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!
    if (arg === "--bare") {
      bare = true
      continue
    }
    if (arg === "--with") {
      const next = argv[i + 1]
      if (!next) {
        log.error("--with requires a comma-separated list of plugin slugs.")
        process.exit(1)
      }
      withList = parsePluginList(next)
      i += 1
      continue
    }
    if (arg.startsWith("--with=")) {
      withList = parsePluginList(arg.slice("--with=".length))
      continue
    }
    if (arg.startsWith("-")) {
      log.error(`Unknown flag: ${arg}`)
      process.exit(1)
    }
    positionals.push(arg)
  }

  return { positionals, withList, bare }
}

function parsePluginList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

async function choosePlugins(opts: {
  entry: Boilerplate
  reg: Registry
  compat: Plugin[]
  withList: string[] | null
}): Promise<Plugin[]> {
  const { entry, reg, compat, withList } = opts

  if (withList !== null) {
    const resolution = resolvePluginSelection(entry, withList, reg)
    if (resolution.unknown.length > 0) {
      log.error(`Unknown plugin slugs: ${resolution.unknown.join(", ")}`)
      cancel("Scaffold aborted.")
      process.exit(2)
    }
    if (resolution.incompatible.length > 0) {
      log.error(
        `Plugins not compatible with "${entry.slug}": ${resolution.incompatible.join(
          ", "
        )}`
      )
      log.info(
        `Compatible plugins: ${compat.map((p) => p.slug).join(", ") || "(none)"}`
      )
      cancel("Scaffold aborted.")
      process.exit(2)
    }
    if (resolution.conflicts.length > 0) {
      for (const [a, b] of resolution.conflicts) {
        log.error(`Plugins "${a}" and "${b}" cannot be combined.`)
      }
      cancel("Scaffold aborted.")
      process.exit(2)
    }
    if (resolution.added.length > 0) {
      log.info(
        `Auto-added prerequisites: ${resolution.added
          .map((p) => color.cyan(p.slug))
          .join(", ")}`
      )
    }
    return resolution.apply
  }

  const selectedSlugs = await pickPlugins(compat)
  if (selectedSlugs === CANCEL) {
    log.info("Skipping plugins.")
    return []
  }
  if (selectedSlugs.length === 0) return []

  const resolution = resolvePluginSelection(entry, selectedSlugs, reg)
  if (resolution.conflicts.length > 0) {
    for (const [a, b] of resolution.conflicts) {
      log.error(`Plugins "${a}" and "${b}" cannot be combined.`)
    }
    cancel("Scaffold aborted.")
    process.exit(2)
  }
  if (resolution.added.length > 0) {
    log.info(
      `Auto-added prerequisites: ${resolution.added
        .map((p) => color.cyan(p.slug))
        .join(", ")}`
    )
  }
  return resolution.apply
}

async function consolidateEnvExample(
  dir: string,
  base: Boilerplate,
  plugins: Plugin[]
): Promise<number> {
  const wanted = new Set<string>()
  for (const v of base.envSetup ?? []) wanted.add(v)
  for (const p of plugins) for (const v of p.env ?? []) wanted.add(v)
  if (wanted.size === 0) return 0

  const envPath = join(dir, ".env.example")
  let existing = ""
  try {
    existing = await readFile(envPath, "utf8")
  } catch {
    // file doesn't exist — write a fresh one
  }

  const ENV_KEY = /^\s*([A-Z][A-Z0-9_]*)\s*=/
  const existingKeys = new Set<string>()
  for (const line of existing.split(/\r?\n/)) {
    const match = line.match(ENV_KEY)
    if (match) existingKeys.add(match[1]!)
  }

  const missing = [...wanted].filter((k) => !existingKeys.has(k))
  if (missing.length === 0) return 0

  const banner = "# Added by boila"
  const block = `\n${banner}\n${missing.map((k) => `${k}=`).join("\n")}\n`
  const next = existing ? existing.trimEnd() + "\n" + block : block.trimStart()
  await writeFile(envPath, next, "utf8")
  return missing.length
}

function printRecap(b: Boilerplate, plugins: Plugin[], dir: string) {
  const relativeDir = relativeOrAbsolute(dir)

  const steps: string[] = [
    `${color.dim("$")} cd ${relativeDir}`,
    `${color.dim("$")} ${b.installCommand ?? "pnpm install"}`,
  ]
  const postInstalls = plugins
    .map((p) => p.postInstall)
    .filter((cmd): cmd is string => Boolean(cmd))
  for (const cmd of dedupe(postInstalls)) {
    steps.push(`${color.dim("$")} ${cmd}`)
  }
  steps.push(`${color.dim("$")} ${pickDevCommand(b)}`)
  note(steps.join("\n"), "Next steps")

  const envVars = new Set<string>()
  for (const v of b.envSetup ?? []) envVars.add(v)
  for (const p of plugins) for (const v of p.env ?? []) envVars.add(v)
  if (envVars.size > 0) {
    note([...envVars].map((v) => color.cyan(v)).join("\n"), "Environment variables")
  }

  if (plugins.length > 0) {
    const lines = plugins.map(
      (p) =>
        `${color.cyan(p.slug.padEnd(14))} ${color.dim(
          `https://boila.dev/plugins/${p.slug}`
        )}`
    )
    note(lines.join("\n"), "Plugins applied")
  }

  if (b.demo) {
    log.message(color.dim(`Live demo: ${b.demo}`))
  }
}

function pickDevCommand(b: Boilerplate): string {
  // The install command often hints at the package manager (`pnpm install`,
  // `bun install`, `npm install`). Mirror it in the `dev` line so the user
  // doesn't have to swap mentally.
  const install = b.installCommand ?? "pnpm install"
  if (install.startsWith("bun")) return "bun dev"
  if (install.startsWith("yarn")) return "yarn dev"
  if (install.startsWith("npm")) return "npm run dev"
  return "pnpm dev"
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

function relativeOrAbsolute(dir: string): string {
  const cwd = process.cwd()
  if (dir.startsWith(cwd + "/")) return "./" + dir.slice(cwd.length + 1)
  return dir
}

async function safeLoadRegistry(): Promise<Registry> {
  try {
    return await loadRegistry()
  } catch (err) {
    log.error((err as Error).message)
    process.exit(3)
  }
}

main().catch((err) => {
  log.error(`Unexpected error: ${(err as Error).message}`)
  process.exit(1)
})
