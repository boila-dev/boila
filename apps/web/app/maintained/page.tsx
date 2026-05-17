import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"

import { BoilerplateCard } from "@/components/boilerplate-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { BOILERPLATES } from "@/lib/boilerplates"

export const metadata = {
  title: "Maintained starters",
  description: "Boilerplates with an upstream commit in the last 6 months.",
}

export default function MaintainedPage() {
  const maintained = BOILERPLATES.filter((b) => b.maintained)
  const archived = BOILERPLATES.filter((b) => !b.maintained)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Maintained starters
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              The catalog,
              <br />
              minus the abandonware.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              An entry is considered maintained when its upstream repo has a
              commit within the last six months. {maintained.length} of{" "}
              {BOILERPLATES.length} entries currently qualify.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-center gap-3">
            <Badge variant="coral">Live</Badge>
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {maintained.length} starters
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {maintained.map((b) => (
              <BoilerplateCard key={b.slug} b={b} />
            ))}
          </div>

          {archived.length > 0 && (
            <div className="mt-24 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Archived</Badge>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {archived.length} starters
                </span>
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                These entries fell out of maintenance. We keep them around for
                reference, but a fresh fork is usually a better path than
                reviving stale dependencies.
              </p>
              <div className="grid grid-cols-1 gap-5 opacity-70 md:grid-cols-2 lg:grid-cols-3">
                {archived.map((b) => (
                  <BoilerplateCard key={b.slug} b={b} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-24 flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Spotted an out-of-date entry?
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Open a PR flipping the{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
                maintained
              </code>{" "}
              flag to{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
                false
              </code>{" "}
              — or, better, find a maintained fork and replace the entry.
            </p>
            <div>
              <Link
                href="/contribute"
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
              >
                Open a contribution PR →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
