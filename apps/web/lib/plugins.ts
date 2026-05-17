/*
 * Client-safe plugin view.
 *
 * Mirrors `./boilerplates.ts`. Plugin frontmatter is validated against
 * plugin.schema.json at build time and surfaced through registry.json's
 * `plugins` array.
 */
import registry from "../public/registry.json"
import { BOILERPLATES, type Boilerplate } from "./boilerplates"

export const PLUGIN_CATEGORIES = [
  "auth",
  "payments",
  "email",
  "analytics",
  "db",
  "monitoring",
  "observability",
  "ui",
  "misc",
] as const

export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number]

export type Plugin = {
  slug: string
  name: string
  description: string
  category: PluginCategory
  compatibleStacks?: string[]
  requires?: string[]
  conflicts?: string[]
  env?: string[]
  source: {
    repo: string
    branch?: string
    subdir: string
  }
  postInstall?: string
  authors: string[]
  maintained: boolean
  license: string
  docs?: string
  addedAt: string
}

export const PLUGIN_CATEGORY_LABELS: Record<PluginCategory, string> = {
  auth: "Auth",
  payments: "Payments",
  email: "Email",
  analytics: "Analytics",
  db: "Database",
  monitoring: "Monitoring",
  observability: "Observability",
  ui: "UI",
  misc: "Misc",
}

const RAW_PLUGINS: Plugin[] =
  ((registry as { plugins?: Plugin[] }).plugins as Plugin[]) ?? []

export const PLUGINS: Plugin[] = RAW_PLUGINS

export function getPlugin(slug: string): Plugin | undefined {
  return PLUGINS.find((p) => p.slug === slug)
}

export function getPlugins(slugs: readonly string[] | undefined): Plugin[] {
  if (!slugs || slugs.length === 0) return []
  return slugs
    .map((s) => getPlugin(s))
    .filter((p): p is Plugin => Boolean(p))
}

export function listPluginSlugs(): string[] {
  return PLUGINS.map((p) => p.slug)
}

export function pluginsByCategory(): Array<{
  category: PluginCategory
  label: string
  plugins: Plugin[]
}> {
  return PLUGIN_CATEGORIES.map((category) => ({
    category,
    label: PLUGIN_CATEGORY_LABELS[category],
    plugins: PLUGINS.filter((p) => p.category === category),
  })).filter((g) => g.plugins.length > 0)
}

export function boilerplatesUsingPlugin(slug: string): {
  bundledIn: Boilerplate[]
  compatibleWith: Boilerplate[]
} {
  return {
    bundledIn: BOILERPLATES.filter((b) =>
      (b.bundledPlugins ?? []).includes(slug)
    ),
    compatibleWith: BOILERPLATES.filter((b) =>
      (b.compatiblePlugins ?? []).includes(slug)
    ),
  }
}
