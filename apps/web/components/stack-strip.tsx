import { StackIcon } from "./stack-icon"

/*
 * Cohere trust-logo-strip analogue: quiet, centered headline above a
 * monochrome row of stack marks. No cards, no borders, big spacing.
 */
const STACKS: { slug: string; label: string }[] = [
  { slug: "next", label: "Next.js" },
  { slug: "remix", label: "Remix" },
  { slug: "astro", label: "Astro" },
  { slug: "vite", label: "Vite" },
  { slug: "sveltekit", label: "SvelteKit" },
  { slug: "hono", label: "Hono" },
  { slug: "trpc", label: "tRPC" },
  { slug: "shadcn", label: "shadcn/ui" },
]

export function StackStrip() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
          Covers every stack you actually ship
        </p>
        <ul className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {STACKS.map((s) => (
            <li
              key={s.slug}
              className="inline-flex items-center gap-2.5 text-foreground/55 transition-colors hover:text-foreground"
            >
              <StackIcon slug={s.slug} className="size-5" />
              <span className="font-display text-lg tracking-[-0.01em]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
