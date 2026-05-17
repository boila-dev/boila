import type { MetadataRoute } from "next"

import { BOILERPLATES } from "@/lib/boilerplates"
import { PLUGINS } from "@/lib/plugins"
import { SITE_URL } from "@/lib/site-url"

// Required when `output: "export"` — Next won't otherwise emit a static file.
export const dynamic = "force-static"

const STATIC_ROUTES = [
  "",
  "/about",
  "/changelog",
  "/contribute",
  "/guidelines",
  "/license",
  "/maintained",
  "/plugins",
  "/stacks",
  "/use-cases",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().slice(0, 10)

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }))

  const boilerplateEntries: MetadataRoute.Sitemap = BOILERPLATES.map((b) => ({
    url: `${SITE_URL}/${b.slug}`,
    lastModified: b.addedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const pluginEntries: MetadataRoute.Sitemap = PLUGINS.map((p) => ({
    url: `${SITE_URL}/plugins/${p.slug}`,
    lastModified: p.addedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...boilerplateEntries, ...pluginEntries]
}
