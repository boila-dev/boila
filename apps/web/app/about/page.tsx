import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Manifesto",
  description: "Why a registry, why a CLI, why curation matters.",
}

const PRINCIPLES = [
  {
    label: "01",
    title: "One CLI, one registry",
    body: "Every framework ships its own create-* command. They all do the same thing, none of them know about each other. Boila collapses that surface into a single, curated catalog and a single command.",
  },
  {
    label: "02",
    title: "Curation is the moat",
    body: "Scraping GitHub for trending starters produces noise. The value of Boila is the editorial pass — a maintainer checked that the install path works, the license is permissive, and the intent is distinct from existing entries.",
  },
  {
    label: "03",
    title: "Indexed by intent, not just by stack",
    body: "Most people don't pick a boilerplate by framework anymore. They pick by what they're shipping — a SaaS, a landing, an API. The taxonomy reflects that.",
  },
  {
    label: "04",
    title: "Static all the way down",
    body: "No backend. No database. No auth. The registry is files in this repo. PRs are the contribution gate. The site is HTML, the search is local, the CLI talks to a static JSON.",
  },
] as const

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 pt-16 pb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Manifesto
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-7xl">
              Pick a starter.
              <br />
              Stop the bookmark
              <br />
              graveyard.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
              Every dev keeps a Notion page of starters they'll someday try.
              Most never get opened twice. Boila is a curated registry plus a
              single command — pick the thing, scaffold it, ship it.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <ol className="grid gap-10 md:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <li
                  key={p.label}
                  className="flex flex-col gap-3 border-t border-border pt-6"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-coral">
                    {p.label}
                  </span>
                  <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">
                    {p.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-brand-deep-green text-white">
          <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-24">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-white/60">
              Where to next
            </span>
            <h2 className="font-display text-4xl leading-tight tracking-[-0.02em] md:text-5xl">
              The catalog grows when you contribute.
            </h2>
            <p className="max-w-2xl text-white/75">
              Boila is community-curated. If you maintain a starter that
              passes the bar, send it through. The PR template walks you
              through it.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="primary-on-dark">
                <Link href="/contribute">
                  Open a contribution PR
                  <ArrowRightIcon
                    data-icon="inline-end"
                    className="ml-1"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="text-white decoration-white/40 hover:decoration-white"
              >
                <Link href="/guidelines">Read the curation guidelines</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
