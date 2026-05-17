import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex flex-1 items-center">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 py-32">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            404 — Not in the registry
          </span>
          <h1 className="font-display text-6xl leading-none tracking-[-0.03em] md:text-7xl">
            That slug isn’t in the catalog.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            It might have been renamed, removed, or never reviewed in the
            first place. Browse the full catalog, or open a PR if you think it
            belongs here.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/">Browse the catalog</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contribute">Contribute a starter</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
