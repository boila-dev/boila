import Link from "next/link"
import {
  CheckCircle2Icon,
  ScrollTextIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Curation guidelines",
  description: "How the Boila registry stays useful — what we accept and why.",
}

const ACCEPT = [
  {
    title: "Maintained upstream",
    body: "Commit within the last 6 months. We don't ship abandoned starters — the catalog is a curation, not an archive.",
  },
  {
    title: "Works from a clean clone",
    body: "Install + run must succeed on a fresh machine. If the README needs a paragraph of pre-setup, it's not a boilerplate.",
  },
  {
    title: "Permissive license",
    body: "MIT, Apache-2.0, ISC, or BSD only. Anything copyleft or unclear bounces.",
  },
  {
    title: "Distinct intent",
    body: "Two starters can share a stack if they solve different problems. A 9th Next + Tailwind landing kit needs a real reason.",
  },
  {
    title: "One-line description",
    body: "Max 120 chars, no marketing voice. Tell someone what they get, not how it'll change their life.",
  },
] as const

const REJECT = [
  {
    title: "Personal scratch repos",
    body: "If you wouldn't recommend it to a colleague tomorrow, don't submit it.",
  },
  {
    title: "Tutorials and walkthroughs",
    body: "Step-by-step learning projects belong on a blog or a docs site, not in a scaffolding registry.",
  },
  {
    title: "Demos that need a paid SaaS to run",
    body: "Required Stripe / Auth0 / Supabase keys are fine — we surface them. But scaffolds that crash without a paid account are out.",
  },
  {
    title: "Forks with cosmetic changes only",
    body: "If your fork is 90% upstream + a renamed README, submit upstream instead.",
  },
] as const

export default function GuidelinesPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 pt-16 pb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Curation guidelines
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Curation is the moat.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Boila stays useful because every entry was reviewed before it
              landed. These are the rules a maintainer applies to your PR —
              read them before you open one and you'll get through in a single
              round.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/contribute">Open a contribution PR</Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="https://github.com/boila-dev/boila/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Discuss an edge case
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="size-5 text-brand-coral" />
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                What we accept
              </h2>
            </div>
            <ul className="mt-10 flex flex-col divide-y divide-border border-y border-border">
              {ACCEPT.map((rule) => (
                <li key={rule.title} className="flex gap-4 py-6">
                  <CheckCircle2Icon className="mt-1 size-5 shrink-0 text-foreground/40" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl leading-tight tracking-[-0.01em]">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rule.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="flex items-center gap-3">
              <XCircleIcon className="size-5 text-muted-foreground" />
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                What we don't accept
              </h2>
            </div>
            <ul className="mt-10 flex flex-col divide-y divide-border border-y border-border">
              {REJECT.map((rule) => (
                <li key={rule.title} className="flex gap-4 py-6">
                  <XCircleIcon className="mt-1 size-5 shrink-0 text-foreground/40" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl leading-tight tracking-[-0.01em]">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rule.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-20">
            <div className="flex items-center gap-3">
              <ScrollTextIcon className="size-5 text-muted-foreground" />
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                What CI enforces
              </h2>
            </div>
            <p className="text-base leading-relaxed text-foreground/85">
              Every PR runs two automated checks before a human looks at it.
              Pass them locally first to save a round trip.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-foreground/85">
              <li>
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  npm run registry:validate
                </code>{" "}
                — every <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  .mdx
                </code>{" "}
                frontmatter must validate against{" "}
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  registry.schema.json
                </code>
                . Slug, license, dates, all required fields.
              </li>
              <li>
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  npm run check:links
                </code>{" "}
                — every <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  repo
                </code>{" "}
                and{" "}
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  demo
                </code>{" "}
                URL is HEAD-pinged. 4xx/5xx fails the run; 429 is a warning.
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              A reviewer adds the curation eye on top — distinct intent, fit
              with the existing catalog, quality of the README. Most PRs land
              within a week.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
