/*
 * Client-safe registry view.
 *
 * The full source of truth is the `.mdx` files under
 * `apps/web/content/boilerplates/`. At build time, `scripts/build-registry.ts`
 * extracts the frontmatter (validated against `registry.schema.json`) into
 * `apps/web/public/registry.json`. That JSON is the public contract for the
 * CLI and the import target here — so client components, server components,
 * and the CLI all share one shape.
 *
 * For the detail page body (rendered MDX), use `getBoilerplateBody(slug)`
 * from `./boilerplate-body.ts` — that helper is server-only and reads the
 * original .mdx file from disk.
 */
import registry from "../public/registry.json"

export const USE_CASES = [
  "saas",
  "landing",
  "dashboard",
  "monorepo",
  "api",
  "ecommerce",
  "blog",
  "docs",
] as const

export type UseCase = (typeof USE_CASES)[number]

export type Boilerplate = {
  slug: string
  name: string
  description: string
  repo: string
  branch?: string
  subdir?: string
  stack: string[]
  useCases: UseCase[]
  features?: string[]
  bundledPlugins?: string[]
  compatiblePlugins?: string[]
  authors: string[]
  maintained: boolean
  license: string
  demo?: string
  preview?: string
  addedAt: string
  installCommand?: string
  envSetup?: string[]
}

export const USE_CASE_LABELS: Record<UseCase, string> = {
  saas: "SaaS",
  landing: "Landing",
  dashboard: "Dashboard",
  monorepo: "Monorepo",
  api: "API",
  ecommerce: "Ecommerce",
  blog: "Blog",
  docs: "Docs",
}

export const STACK_LABELS: Record<string, string> = {
  next: "Next.js",
  remix: "Remix",
  astro: "Astro",
  vite: "Vite",
  sveltekit: "SvelteKit",
  typescript: "TypeScript",
  tailwind: "Tailwind",
  prisma: "Prisma",
  drizzle: "Drizzle",
  trpc: "tRPC",
  hono: "Hono",
  shadcn: "shadcn/ui",
  turborepo: "Turborepo",
  bun: "Bun",
  vercel: "Vercel",
  cloudflare: "Cloudflare",
  supabase: "Supabase",
  clerk: "Clerk",
  stripe: "Stripe",
  postgres: "Postgres",
  redis: "Redis",
}

export const BOILERPLATES: Boilerplate[] =
  (registry.boilerplates as Boilerplate[]) ?? []

export function getBoilerplate(slug: string): Boilerplate | undefined {
  return BOILERPLATES.find((b) => b.slug === slug)
}

export function listSlugs(): string[] {
  return BOILERPLATES.map((b) => b.slug)
}
