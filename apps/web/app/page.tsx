import { Suspense } from "react"

import { ActiveFilters } from "@/components/active-filters"
import { Catalog } from "@/components/catalog"
import { FeatureBand } from "@/components/feature-band"
import { Hero } from "@/components/hero"
import { SearchInput } from "@/components/search-input"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StackStrip } from "@/components/stack-strip"
import { TaxonomyChips } from "@/components/taxonomy-chips"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <StackStrip />

        <section id="catalog" className="border-b border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Catalog
              </span>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h2 className="font-display text-4xl leading-tight tracking-[-0.02em] md:text-5xl">
                  Filter by what you’re shipping.
                </h2>
                <Suspense fallback={null}>
                  <SearchInput />
                </Suspense>
              </div>
              <Suspense fallback={null}>
                <TaxonomyChips />
              </Suspense>
              <Suspense fallback={null}>
                <ActiveFilters />
              </Suspense>
            </div>
            <Suspense fallback={<CatalogFallback />}>
              <Catalog />
            </Suspense>
          </div>
        </section>

        <FeatureBand />
      </main>
      <SiteFooter />
    </div>
  )
}

function CatalogFallback() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-border bg-card/40"
        />
      ))}
    </div>
  )
}
