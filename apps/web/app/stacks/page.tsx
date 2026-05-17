import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StackIcon } from "@/components/stack-icon"
import { aggregateByStack } from "@/lib/aggregations"

export const metadata = {
  title: "Stacks",
  description: "Browse boilerplates by the technologies they use.",
}

export default function StacksPage() {
  const stacks = aggregateByStack()
  const total = stacks.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Browse by stack
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Pick the tech.
              <br />
              We’ll surface the starters.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {stacks.length} technologies covered across {total} stack
              appearances. Click any stack to filter the catalog.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/?stack=${s.slug}#catalog`}
                  className="group/stackcard flex h-full items-center justify-between gap-4 bg-card p-6 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <StackIcon slug={s.slug} className="size-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-display text-lg tracking-[-0.01em]">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                        {s.count} {s.count === 1 ? "starter" : "starters"}
                      </span>
                    </div>
                  </div>
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 text-muted-foreground transition-transform group-hover/stackcard:translate-x-0.5 group-hover/stackcard:text-foreground"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Don’t see a stack?
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              The registry follows what gets submitted. If your stack is
              missing, the fastest way to surface it is to contribute a
              boilerplate that uses it.
            </p>
            <div>
              <Link
                href="/contribute"
                className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
              >
                Open a contribution PR
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Silence the unused warning while keeping the symbol around in case the
// page later renders inline badges for stacks.
void Badge
