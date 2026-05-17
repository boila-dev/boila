import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boila.dev"

// Required when `output: "export"` — Next won't otherwise emit a static file.
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pagefind ships its own index; no value in letting bots crawl it.
        disallow: ["/pagefind/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
