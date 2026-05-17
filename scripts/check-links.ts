/*
 * check-links.ts
 *
 * Pings every `repo` (and `demo`, if present) URL in the registry to make
 * sure the upstream is still reachable. Designed to run in CI as the
 * "link checker" mentioned in CLAUDE.md §Contribution flow.
 *
 * Behaviour:
 *   - Issues a HEAD request first, falls back to GET if HEAD is rejected
 *     (some hosts disallow HEAD).
 *   - Tolerates GitHub-style 429 (rate limit) and reports them as warnings
 *     rather than failures, so a flaky CI run doesn't block a valid PR.
 *   - Exits non-zero only on confirmed 4xx/5xx failures.
 *
 * Flags:
 *   --json     machine-readable summary on stdout
 *   --strict   treat warnings (timeouts, 429) as failures
 */
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

type AnyRecord = Record<string, unknown>

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY_PATH = join(__dirname, "..", "apps/web/public/registry.json")

const TIMEOUT_MS = 8_000
const JSON_OUT = process.argv.includes("--json")
const STRICT = process.argv.includes("--strict")

type Outcome = "ok" | "warn" | "fail"
type Check = {
  slug: string
  field: "repo" | "demo"
  url: string
  outcome: Outcome
  status?: number
  detail?: string
}

async function main() {
  const raw = await readFile(REGISTRY_PATH, "utf8")
  const reg = JSON.parse(raw) as { boilerplates: AnyRecord[] }

  const targets: { slug: string; field: "repo" | "demo"; url: string }[] = []
  for (const b of reg.boilerplates) {
    if (typeof b.repo === "string") {
      targets.push({ slug: String(b.slug), field: "repo", url: b.repo })
    }
    if (typeof b.demo === "string") {
      targets.push({ slug: String(b.slug), field: "demo", url: b.demo })
    }
  }

  // Bounded concurrency: 6 in-flight at a time keeps GitHub happy.
  const results: Check[] = []
  const queue = [...targets]
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length > 0) {
      const next = queue.shift()
      if (!next) break
      results.push(await probe(next))
    }
  })
  await Promise.all(workers)

  const fails = results.filter((r) => r.outcome === "fail")
  const warns = results.filter((r) => r.outcome === "warn")

  if (JSON_OUT) {
    process.stdout.write(
      JSON.stringify(
        { total: results.length, ok: results.length - fails.length - warns.length, warn: warns.length, fail: fails.length, results },
        null,
        2
      ) + "\n"
    )
  } else {
    printHuman(results)
  }

  const exitWithError = fails.length > 0 || (STRICT && warns.length > 0)
  process.exit(exitWithError ? 1 : 0)
}

async function probe(t: {
  slug: string
  field: "repo" | "demo"
  url: string
}): Promise<Check> {
  const tried = ["HEAD", "GET"] as const
  let lastErr: unknown = null
  for (const method of tried) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
      const res = await fetch(t.url, {
        method,
        signal: ctrl.signal,
        redirect: "follow",
        headers: { "user-agent": "boila-link-checker/0.1" },
      })
      clearTimeout(timer)
      if (res.status === 429) {
        return {
          ...t,
          outcome: "warn",
          status: res.status,
          detail: "rate limited (429)",
        }
      }
      if (res.status >= 200 && res.status < 400) {
        return { ...t, outcome: "ok", status: res.status }
      }
      if (method === "HEAD" && (res.status === 405 || res.status === 501)) {
        // Host doesn't allow HEAD — fall through to GET retry.
        continue
      }
      return {
        ...t,
        outcome: "fail",
        status: res.status,
        detail: `HTTP ${res.status}`,
      }
    } catch (err) {
      lastErr = err
      // Network error / timeout — retry once via the other method.
    }
  }
  const message =
    (lastErr as Error | null)?.name === "AbortError"
      ? "timeout"
      : (lastErr as Error | null)?.message ?? "unknown error"
  return { ...t, outcome: "warn", detail: message }
}

function printHuman(results: Check[]) {
  const sym: Record<Outcome, string> = {
    ok: "✓",
    warn: "!",
    fail: "✗",
  }
  for (const r of results) {
    const status = r.status ? ` ${r.status}` : ""
    const detail = r.detail ? ` — ${r.detail}` : ""
    process.stdout.write(
      `${sym[r.outcome]} ${r.slug} (${r.field})${status}${detail}\n  ${r.url}\n`
    )
  }
  const fails = results.filter((r) => r.outcome === "fail").length
  const warns = results.filter((r) => r.outcome === "warn").length
  const ok = results.length - fails - warns
  process.stdout.write(
    `\nTotal: ${results.length}  ok: ${ok}  warn: ${warns}  fail: ${fails}\n`
  )
  if (fails > 0) {
    process.stderr.write(
      `[check-links] ${fails} link${fails > 1 ? "s" : ""} failed.\n`
    )
  } else if (warns > 0 && STRICT) {
    process.stderr.write(
      `[check-links] ${warns} warning${warns > 1 ? "s" : ""} (strict mode).\n`
    )
  }
}

main().catch((err) => {
  console.error("[check-links] fatal:", err)
  process.exit(2)
})
