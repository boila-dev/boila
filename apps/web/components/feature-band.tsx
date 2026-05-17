import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

const PILLARS = [
  {
    label: "01",
    title: "Curated, not crawled",
    body: "Every boilerplate goes through a PR-only review. Maintenance, license, install path — all checked before it lands.",
  },
  {
    label: "02",
    title: "One command, any stack",
    body: "`npx @boila/cli <slug>` resolves through a single registry. No more memorising create-this, create-that, or hunting for repo URLs.",
  },
  {
    label: "03",
    title: "Indexed by use case",
    body: "SaaS, landing, dashboard, API, docs — the catalog is browsable by what you’re actually building, not just by framework.",
  },
] as const

export function FeatureBand() {
  return (
    <section className="bg-brand-deep-green text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-24 md:py-32">
        <div className="flex flex-col gap-6 md:max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-white/60">
            Why a registry
          </span>
          <h2 className="font-display text-4xl leading-tight tracking-[-0.02em] md:text-5xl">
            Stop bookmarking starters in a Notion you’ll never open again.
          </h2>
        </div>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {PILLARS.map((p) => (
            <li key={p.label} className="flex flex-col gap-4 border-t border-white/15 pt-6">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-coral">
                {p.label}
              </span>
              <h3 className="font-display text-2xl leading-tight tracking-[-0.01em]">
                {p.title}
              </h3>
              <p className="text-sm text-white/70">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary-on-dark">
            <Link href="/contribute">
              Submit a boilerplate
              <ArrowRightIcon data-icon="inline-end" className="ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="text-white decoration-white/40 hover:decoration-white"
          >
            <Link href="/guidelines">Read the guidelines</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
