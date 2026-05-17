import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { InstallCommand } from "./install-command"
import { StackIcon } from "./stack-icon"

export function Hero() {
  return (
    <section>
      <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-20 pb-24 md:grid-cols-[1.2fr_1fr] md:gap-12 md:pt-28 md:pb-32">
        <div className="flex flex-col gap-10">
          <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
            The boilerplate registry
          </span>
          <h1 className="font-display text-[3.25rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl md:text-7xl">
            Pick a starter.
            <br />
            Ship today.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            One CLI command to scaffold any boilerplate in the catalog. Curated
            entries, real licenses, real maintenance — no more memorising
            <span className="text-foreground"> create-this</span>,
            <span className="text-foreground"> create-that</span>.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#catalog">
                Browse the catalog
                <ArrowRightIcon data-icon="inline-end" className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contribute">Contribute a starter</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:pt-10">
          <InstallCommand command="npx @boila/cli t3-saas-starter" />
          <div className="rounded-2xl bg-brand-deep-green p-6 text-white">
            <div className="flex items-center justify-between font-mono text-xs tracking-[0.08em] text-white/60 uppercase">
              <span>Today’s pick</span>
              <span>2 min ago</span>
            </div>
            <p className="mt-6 font-display text-2xl leading-tight tracking-[-0.01em]">
              Supabase Dashboard Kit
            </p>
            <p className="mt-2 text-sm text-white/70">
              Server-component dashboard with auth, RLS, realtime, and a small
              chart kit.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {(["next", "supabase", "shadcn"] as const).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2 py-0.5 text-xs text-white/80"
                >
                  <StackIcon slug={s} className="size-3" />
                  {s === "next"
                    ? "Next.js"
                    : s === "shadcn"
                      ? "shadcn"
                      : "Supabase"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
