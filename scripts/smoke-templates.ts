/*
 * smoke-templates.ts
 *
 * Scaffolds every boilerplate (bare + with all compatible plugins) into a
 * temp dir, installs deps, and runs either a typecheck (--mode=typecheck,
 * default) or a full build (--mode=build).
 *
 * The CLI is invoked through the local templates folder via
 * BOILA_TEMPLATES_DIR, so this runs without any GitHub network access.
 *
 * Exit codes:
 *   0 — every combo passed
 *   1 — at least one combo failed
 *
 * Flags:
 *   --mode=typecheck|build   what to run after install (default: typecheck)
 *   --only=<slug>            limit to a single boilerplate
 *   --keep-failed            don't delete the temp dir on failure (debug)
 *   --pkg=npm|pnpm|bun       package manager to use for installs (default: npm)
 *
 * Plugins frequently declare `postInstall` with `pnpm add ...`. When the
 * package manager is `npm`, the script rewrites `pnpm add` → `npm install`
 * so the script works in environments without pnpm.
 */
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { spawn } from "node:child_process"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync } from "node:fs"

type Boilerplate = {
  slug: string
  name: string
  installCommand?: string
  compatiblePlugins?: string[]
}

type Plugin = {
  slug: string
  postInstall?: string
}

type Registry = {
  boilerplates: Boilerplate[]
  plugins?: Plugin[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const REGISTRY_PATH = join(ROOT, "apps/web/public/registry.json")
const TEMPLATES_DIR = join(ROOT, "templates")
const CLI_PATH = join(ROOT, "packages/cli/dist/index.js")

const args = process.argv.slice(2)
const MODE = getFlag("--mode") ?? "typecheck"
const PKG = (getFlag("--pkg") ?? "npm") as "npm" | "pnpm" | "bun"
const ONLY = getFlag("--only")
const KEEP_FAILED = args.includes("--keep-failed")

if (MODE !== "typecheck" && MODE !== "build") {
  console.error(`invalid --mode "${MODE}" (expected typecheck or build)`)
  process.exit(1)
}

async function main() {
  if (!existsSync(CLI_PATH)) {
    console.error(
      `CLI not built. Run \`npm --workspace @boila/cli run build\` first.\n  expected: ${CLI_PATH}`
    )
    process.exit(1)
  }
  if (!existsSync(REGISTRY_PATH)) {
    console.error(
      `Registry not built. Run \`npm run registry:build\` first.\n  expected: ${REGISTRY_PATH}`
    )
    process.exit(1)
  }

  const registry: Registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8"))
  const allPlugins = registry.plugins ?? []

  const results: { combo: string; ok: boolean; ms: number; err?: string }[] = []

  for (const b of registry.boilerplates) {
    if (ONLY && b.slug !== ONLY) continue

    // Test #1: bare
    results.push(
      await runCombo(`${b.slug} (bare)`, () =>
        testScaffold({ b, pluginSlugs: [], allPlugins })
      )
    )

    // Test #2: with every compatible plugin layered on
    const compat = b.compatiblePlugins ?? []
    if (compat.length > 0) {
      results.push(
        await runCombo(`${b.slug} (+ ${compat.join(", ")})`, () =>
          testScaffold({ b, pluginSlugs: compat, allPlugins })
        )
      )
    }
  }

  console.log("")
  console.log("--- summary ---")
  const passed = results.filter((r) => r.ok)
  const failed = results.filter((r) => !r.ok)
  for (const r of results) {
    const tag = r.ok ? "✓" : "✗"
    console.log(`  ${tag} ${r.combo.padEnd(50)} ${formatMs(r.ms)}`)
  }
  console.log("")
  console.log(`${passed.length} passed, ${failed.length} failed`)

  if (failed.length > 0) {
    console.log("")
    for (const r of failed) {
      console.log(`✗ ${r.combo}`)
      if (r.err) console.log(`  ${r.err.replace(/\n/g, "\n  ")}`)
    }
    process.exit(1)
  }
}

async function runCombo(
  combo: string,
  fn: () => Promise<void>
): Promise<{ combo: string; ok: boolean; ms: number; err?: string }> {
  console.log(`\n▸ ${combo}`)
  const t0 = Date.now()
  try {
    await fn()
    return { combo, ok: true, ms: Date.now() - t0 }
  } catch (err) {
    return {
      combo,
      ok: false,
      ms: Date.now() - t0,
      err: (err as Error).message,
    }
  }
}

async function testScaffold(opts: {
  b: Boilerplate
  pluginSlugs: string[]
  allPlugins: Plugin[]
}) {
  const { b, pluginSlugs, allPlugins } = opts
  const dir = await mkdtemp(join(tmpdir(), `boila-smoke-`))
  // The CLI refuses to scaffold into an existing dir; use a child.
  const projectDir = join(dir, "app")

  let cleanupOnExit = true
  try {
    // 1) scaffold via the CLI
    const cliArgs: string[] = [CLI_PATH, b.slug]
    if (pluginSlugs.length > 0) {
      cliArgs.push("--with", pluginSlugs.join(","))
    } else {
      cliArgs.push("--bare")
    }
    cliArgs.push(projectDir)

    console.log(`  → scaffold via boila ${cliArgs.slice(1).join(" ")}`)
    await run("node", cliArgs, {
      env: {
        ...process.env,
        BOILA_REGISTRY: REGISTRY_PATH,
        BOILA_TEMPLATES_DIR: TEMPLATES_DIR,
        CI: "1",
      },
    })

    // 2) install base deps
    console.log(`  → ${PKG} install`)
    await run(PKG, installArgs(PKG), { cwd: projectDir })

    // 3) run each plugin's postInstall
    for (const slug of pluginSlugs) {
      const p = allPlugins.find((x) => x.slug === slug)
      if (!p?.postInstall) continue
      const cmd = adaptPostInstall(p.postInstall, PKG)
      console.log(`  → postInstall(${slug}): ${cmd}`)
      await run("sh", ["-c", cmd], { cwd: projectDir })
    }

    // 4) typecheck or full build
    if (MODE === "build") {
      console.log(`  → ${PKG} run build`)
      await run(PKG, ["run", "build"], {
        cwd: projectDir,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      })
    } else {
      console.log(`  → tsc --noEmit`)
      await run("npx", ["tsc", "--noEmit"], { cwd: projectDir })
    }
  } catch (err) {
    if (KEEP_FAILED) {
      cleanupOnExit = false
      console.log(`  ! kept failed scaffold at ${projectDir}`)
    }
    throw err
  } finally {
    if (cleanupOnExit) await rm(dir, { recursive: true, force: true })
  }
}

function installArgs(pkg: "npm" | "pnpm" | "bun"): string[] {
  if (pkg === "npm") return ["install", "--no-audit", "--no-fund"]
  if (pkg === "pnpm") return ["install"]
  return ["install"]
}

function adaptPostInstall(cmd: string, pkg: "npm" | "pnpm" | "bun"): string {
  if (pkg === "pnpm") return cmd
  // Rewrite `pnpm add X` → `npm install X` (or bun add).
  // Other `pnpm <whatever>` (e.g. `pnpm drizzle-kit push`) becomes
  // `npx <whatever>` so we don't depend on pnpm being installed.
  const installVerb = pkg === "npm" ? "install" : "add"
  return cmd
    .replace(/\bpnpm add\b/g, `${pkg} ${installVerb}`)
    .replace(/\bpnpm\b/g, "npx")
}

function getFlag(name: string): string | undefined {
  const direct = args.find((a) => a.startsWith(`${name}=`))
  if (direct) return direct.slice(name.length + 1)
  const idx = args.indexOf(name)
  if (idx >= 0) return args[idx + 1]
  return undefined
}

function formatMs(ms: number): string {
  if (ms < 1000) return `(${ms}ms)`
  return `(${(ms / 1000).toFixed(1)}s)`
}

function run(
  cmd: string,
  argv: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {}
): Promise<void> {
  return new Promise((resolveResult, rejectResult) => {
    const child = spawn(cmd, argv, {
      cwd: opts.cwd ?? process.cwd(),
      env: opts.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
    })
    const out: Buffer[] = []
    const err: Buffer[] = []
    child.stdout.on("data", (chunk) => out.push(chunk))
    child.stderr.on("data", (chunk) => err.push(chunk))
    child.on("error", rejectResult)
    child.on("close", (code) => {
      if (code === 0) {
        resolveResult()
      } else {
        const tail = Buffer.concat([...out, ...err])
          .toString("utf8")
          .trim()
          .split("\n")
          .slice(-15)
          .join("\n")
        rejectResult(
          new Error(`${cmd} ${argv.join(" ")} exited ${code}\n${tail}`)
        )
      }
    })
  })
}

main().catch((err) => {
  console.error("[smoke] fatal:", err)
  process.exit(1)
})
