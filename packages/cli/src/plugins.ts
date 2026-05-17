/*
 * Plugin resolution helpers.
 *
 * Given a boilerplate and a registry of plugins, figure out:
 *   - which plugins are compatible with the chosen base
 *   - which prerequisites have to be auto-added if a user picks plugin X
 *   - whether two selected plugins conflict
 *
 * Returns plain data — never throws on user-facing errors; the caller
 * decides how to surface conflicts.
 */
import type { Boilerplate, Plugin, Registry } from "./types.js"

export type Resolution = {
  /** Plugins the user explicitly selected. */
  selected: Plugin[]
  /** Plugins auto-added to satisfy `requires`. */
  added: Plugin[]
  /** Final ordered list to apply (selected + added, deduped). */
  apply: Plugin[]
  /** Slugs that were requested but don't exist in the registry. */
  unknown: string[]
  /** Slugs that exist but aren't listed as compatible with the base. */
  incompatible: string[]
  /** Pairs of plugin slugs that conflict with each other. */
  conflicts: Array<[string, string]>
}

export function compatiblePlugins(
  base: Boilerplate,
  reg: Registry
): Plugin[] {
  const compat = new Set(base.compatiblePlugins ?? [])
  return (reg.plugins ?? []).filter((p) => compat.has(p.slug))
}

export function bundledPlugins(base: Boilerplate, reg: Registry): Plugin[] {
  const bundled = new Set(base.bundledPlugins ?? [])
  return (reg.plugins ?? []).filter((p) => bundled.has(p.slug))
}

export function resolvePluginSelection(
  base: Boilerplate,
  requested: readonly string[],
  reg: Registry
): Resolution {
  const allPlugins = reg.plugins ?? []
  const bySlug = new Map(allPlugins.map((p) => [p.slug, p]))
  const compat = new Set(base.compatiblePlugins ?? [])
  // Bundled plugins are treated as already-present, so they satisfy
  // `requires` without being added again.
  const bundled = new Set(base.bundledPlugins ?? [])

  const unknown: string[] = []
  const incompatible: string[] = []
  const selected: Plugin[] = []
  const seen = new Set<string>()

  for (const slug of requested) {
    if (seen.has(slug)) continue
    seen.add(slug)
    const p = bySlug.get(slug)
    if (!p) {
      unknown.push(slug)
      continue
    }
    if (!compat.has(slug) && !bundled.has(slug)) {
      incompatible.push(slug)
      continue
    }
    if (bundled.has(slug)) continue // already in the base, don't re-apply
    selected.push(p)
  }

  // Walk requires graph and auto-add prerequisites that aren't already
  // selected or bundled.
  const apply: Plugin[] = []
  const inApply = new Set<string>()
  const added: Plugin[] = []

  function visit(p: Plugin) {
    if (inApply.has(p.slug)) return
    for (const req of p.requires ?? []) {
      if (bundled.has(req)) continue
      const dep = bySlug.get(req)
      if (!dep) {
        unknown.push(req)
        continue
      }
      if (!seen.has(dep.slug)) {
        added.push(dep)
        seen.add(dep.slug)
      }
      visit(dep)
    }
    inApply.add(p.slug)
    apply.push(p)
  }
  for (const p of selected) visit(p)

  // Conflict check on the final apply set.
  const inApplySet = new Set(apply.map((p) => p.slug))
  const conflicts: Array<[string, string]> = []
  for (const p of apply) {
    for (const conflictSlug of p.conflicts ?? []) {
      if (inApplySet.has(conflictSlug)) {
        const pair: [string, string] = [p.slug, conflictSlug].sort() as [
          string,
          string,
        ]
        if (
          !conflicts.some(
            (existing) => existing[0] === pair[0] && existing[1] === pair[1]
          )
        ) {
          conflicts.push(pair)
        }
      }
    }
  }

  return { selected, added, apply, unknown, incompatible, conflicts }
}
