import type { ComponentType, SVGProps } from "react"
import {
  SiAstro,
  SiBun,
  SiClerk,
  SiCloudflare,
  SiDrizzle,
  SiHono,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRemix,
  SiShadcnui,
  SiStripe,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTrpc,
  SiTurborepo,
  SiTypescript,
  SiVercel,
  SiVite,
} from "@icons-pack/react-simple-icons"

import { cn } from "@workspace/ui/lib/utils"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/*
 * Mapping from registry stack slug -> Simple Icons brand glyph.
 * Slugs match `STACK_LABELS` in `lib/boilerplates.ts`.
 * Add an entry here when a new stack slug starts showing up in MDX
 * frontmatter — anything unmapped falls back to the text label only.
 */
const STACK_ICONS: Record<string, IconComponent> = {
  next: SiNextdotjs,
  remix: SiRemix,
  astro: SiAstro,
  vite: SiVite,
  sveltekit: SiSvelte,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  prisma: SiPrisma,
  drizzle: SiDrizzle,
  trpc: SiTrpc,
  hono: SiHono,
  shadcn: SiShadcnui,
  turborepo: SiTurborepo,
  bun: SiBun,
  vercel: SiVercel,
  cloudflare: SiCloudflare,
  supabase: SiSupabase,
  clerk: SiClerk,
  stripe: SiStripe,
  postgres: SiPostgresql,
  redis: SiRedis,
  react: SiReact,
  node: SiNodedotjs,
}

export function getStackIcon(slug: string): IconComponent | null {
  return STACK_ICONS[slug] ?? null
}

export function StackIcon({
  slug,
  className,
  ...props
}: { slug: string } & SVGProps<SVGSVGElement>) {
  const Icon = getStackIcon(slug)
  if (!Icon) return null
  return (
    <Icon
      aria-hidden
      className={cn("size-3.5 shrink-0", className)}
      {...props}
    />
  )
}
