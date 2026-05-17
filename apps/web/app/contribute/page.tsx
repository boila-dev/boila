import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  GitBranchIcon,
  ScrollTextIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { GithubMark } from "@/components/icons"
import { InstallCommand } from "@/components/install-command"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Contribute",
  description: "Add a boilerplate to the Boila registry via a single PR.",
}

const STEPS = [
  {
    label: "01",
    title: "Fork the repo",
    body: "Boila is a regular GitHub repo. Fork it like any other open-source project.",
  },
  {
    label: "02",
    title: "Add an MDX entry",
    body: "Drop a single file at apps/web/content/boilerplates/<your-slug>.mdx. The frontmatter is validated against registry.schema.json.",
  },
  {
    label: "03",
    title: "Run the validator",
    body: "pnpm registry:validate runs locally and on CI. It checks frontmatter, license, and that the repo URL still resolves.",
  },
  {
    label: "04",
    title: "Open a PR",
    body: "A maintainer reviews curation fit (intent, maintenance, license) and merges it. Your starter ships with the next deploy.",
  },
] as const

const ACCEPT = [
  "Repo is public and actively maintained (commit within the last 6 months).",
  "Install + run works from a clean clone, no manual surgery.",
  "Intent is distinct from existing entries — different stack alone isn’t enough.",
  "License is permissive (MIT, Apache, ISC, BSD).",
  "Description is one line, max 120 chars, and not marketing-y.",
] as const

const FRONTMATTER = `---
slug: my-starter
name: My Starter
description: One-line pitch, max 120 chars.
repo: https://github.com/<owner>/<repo>
branch: main           # optional, defaults to main
subdir: ""             # optional, for monorepos
stack: [next, typescript, tailwind, prisma]
useCases: [saas, dashboard]
features: [auth, payments]
authors: [your-github-handle]
maintained: true
license: MIT
demo: https://...      # optional
addedAt: 2026-05-17
---

## Why this boilerplate

Markdown body explaining the tradeoffs, what's included, what's not.`

export default function ContributePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 pt-16 pb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Contribute
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Add a boilerplate.
              <br />
              One MDX file. One PR.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Boila has no submission form, no backend, no database — the
              registry is a folder of MDX files. The PR is the curation gate.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link
                  href="https://github.com/boila-dev/boila/fork"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubMark className="mr-1 size-4" />
                  Fork on GitHub
                  <ArrowRightIcon
                    data-icon="inline-end"
                    className="ml-1"
                  />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/guidelines">
                  <ScrollTextIcon
                    data-icon="inline-start"
                    className="mr-1"
                  />
                  Curation guidelines
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
              The four steps.
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-2">
              {STEPS.map((s) => (
                <li
                  key={s.label}
                  className="flex flex-col gap-3 border-t border-border pt-6"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-coral">
                    {s.label}
                  </span>
                  <h3 className="font-display text-xl leading-tight tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Frontmatter shape
              </span>
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                Copy this. Edit the values.
              </h2>
              <p className="text-sm text-muted-foreground">
                The schema is enforced by{" "}
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
                  pnpm registry:validate
                </code>
                . Unknown fields are rejected so the registry stays a stable
                contract for the CLI.
              </p>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/60 p-6 font-mono text-xs leading-relaxed">
              <code>{FRONTMATTER}</code>
            </pre>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <div className="flex items-center gap-3">
              <GitBranchIcon className="size-5 text-muted-foreground" />
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                What we accept
              </h2>
            </div>
            <ul className="mt-10 flex flex-col divide-y divide-border border-y border-border">
              {ACCEPT.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 py-4 text-sm"
                >
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-foreground/40" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-20">
            <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
              Test your entry locally.
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Before opening the PR, scaffold from your new slug to make sure
              the install path is honest. The CLI reads the same registry the
              site does.
            </p>
            <InstallCommand command="pnpm --filter cli dev my-starter" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
