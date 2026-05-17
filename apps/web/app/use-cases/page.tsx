import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"

import { BoilerplateCard } from "@/components/boilerplate-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { aggregateByUseCase } from "@/lib/aggregations"

export const metadata = {
  title: "Use cases",
  description: "Browse boilerplates by what you’re actually building.",
}

export default function UseCasesPage() {
  const useCases = aggregateByUseCase()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Browse by use case
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Start from the thing
              <br />
              you’re actually shipping.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Use cases describe intent, not framework. Most starters fit
              under more than one — pick whichever matches the problem
              you’re solving.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {useCases.map((u) => (
              <li key={u.slug} className="py-10">
                <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_2fr] md:gap-12">
                  <div className="flex flex-col gap-4">
                    <Badge variant="coral" className="w-fit">
                      {u.label}
                    </Badge>
                    <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                      {u.label}
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      {u.count} {u.count === 1 ? "starter" : "starters"}
                    </p>
                    <Link
                      href={`/?useCase=${u.slug}#catalog`}
                      className="mt-2 inline-flex w-fit items-center gap-1 text-sm text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                    >
                      Filter the catalog
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {u.examples.map((b) => (
                      <BoilerplateCard key={b.slug} b={b} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
