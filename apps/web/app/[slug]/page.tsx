import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import { BoilerplateCard } from "@/components/boilerplate-card"
import { GithubMark } from "@/components/icons"
import { InstallCommand } from "@/components/install-command"
import { MarkdownBody } from "@/components/markdown-body"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StackIcon } from "@/components/stack-icon"
import { getBoilerplateBody } from "@/lib/boilerplate-body"
import {
  BOILERPLATES,
  STACK_LABELS,
  USE_CASE_LABELS,
  getBoilerplate,
  listSlugs,
} from "@/lib/boilerplates"
import { getPlugins, PLUGIN_CATEGORY_LABELS } from "@/lib/plugins"

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }))
}

type Params = { slug: string }

export default async function BoilerplatePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const b = getBoilerplate(slug)
  if (!b) notFound()
  const body = getBoilerplateBody(slug)
  const bundled = getPlugins(b.bundledPlugins)
  const compatible = getPlugins(b.compatiblePlugins)

  const related = BOILERPLATES.filter(
    (other) =>
      other.slug !== b.slug &&
      other.useCases.some((u) => b.useCases.includes(u))
  ).slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      {/*
       * Pagefind index scope: `data-pagefind-body` makes this the only
       * type of page indexed (home/stacks/use-cases/contribute are
       * auto-excluded). Title is auto-extracted from the page <h1>;
       * the slug is recovered from the URL on the search client side.
       */}
      <main data-pagefind-body>
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 pt-12 pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              All boilerplates
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              {b.useCases.map((u) => (
                <Badge key={u} variant="coral">
                  {USE_CASE_LABELS[u]}
                </Badge>
              ))}
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Added {formatDate(b.addedAt)}
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              {b.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {b.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InstallCommand slug={b.slug} className="sm:flex-1" />
              <Button asChild variant="outline" className="sm:w-fit">
                <Link href={b.repo} target="_blank" rel="noreferrer">
                  <GithubMark className="mr-1 size-4" />
                  View repo
                  <ArrowUpRightIcon
                    data-icon="inline-end"
                    className="ml-1"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-[1.6fr_1fr]">
            <article className="flex flex-col gap-6">
              {body && <MarkdownBody source={body} />}

              {b.envSetup && b.envSetup.length > 0 && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Environment variables
                  </h3>
                  <ul className="flex flex-col divide-y divide-border border-y border-border">
                    {b.envSetup.map((env) => (
                      <li
                        key={env}
                        className="flex items-center justify-between py-3 font-mono text-sm"
                      >
                        <span>{env}</span>
                        <span className="text-xs text-muted-foreground">
                          required
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {b.features && b.features.length > 0 && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Included
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {b.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2Icon className="size-4 text-foreground/40" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bundled.length > 0 && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Bundled plugins
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Already wired into the base. No flag needed.
                  </p>
                  <ul className="flex flex-col divide-y divide-border border-y border-border">
                    {bundled.map((p) => (
                      <li
                        key={p.slug}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex flex-col">
                          <Link
                            href={`/plugins/${p.slug}`}
                            className="text-sm text-foreground underline-offset-4 hover:underline"
                          >
                            {p.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {p.description}
                          </span>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {PLUGIN_CATEGORY_LABELS[p.category]}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {compatible.length > 0 && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Add-on plugins
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle any of these at scaffold time. The CLI will pick
                    them up via{" "}
                    <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                      --with {compatible.map((p) => p.slug).join(",")}
                    </code>{" "}
                    or interactively.
                  </p>
                  <ul className="flex flex-col divide-y divide-border border-y border-border">
                    {compatible.map((p) => (
                      <li
                        key={p.slug}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex flex-col">
                          <Link
                            href={`/plugins/${p.slug}`}
                            className="text-sm text-foreground underline-offset-4 hover:underline"
                          >
                            {p.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {p.description}
                          </span>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {PLUGIN_CATEGORY_LABELS[p.category]}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <aside className="flex flex-col gap-8 md:border-l md:border-border md:pl-10">
              <MetaRow label="Stack">
                <div className="flex flex-wrap gap-1.5">
                  {b.stack.map((s) => (
                    <Badge key={s} variant="outline" className="gap-1.5">
                      <StackIcon slug={s} />
                      {STACK_LABELS[s] ?? s}
                    </Badge>
                  ))}
                </div>
              </MetaRow>
              <Separator />
              <MetaRow label="License">{b.license}</MetaRow>
              <Separator />
              <MetaRow label="Branch">{b.branch ?? "main"}</MetaRow>
              <Separator />
              <MetaRow label="Maintained">
                {b.maintained ? "Yes" : "No"}
              </MetaRow>
              <Separator />
              <MetaRow label="Authors">
                <div className="flex flex-col gap-1">
                  {b.authors.map((a) => (
                    <Link
                      key={a}
                      href={`https://github.com/${a}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                    >
                      @{a}
                    </Link>
                  ))}
                </div>
              </MetaRow>
              {b.demo && (
                <>
                  <Separator />
                  <MetaRow label="Demo">
                    <Link
                      href={b.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-action-blue underline underline-offset-4 decoration-brand-action-blue/40 hover:decoration-brand-action-blue"
                    >
                      Live preview
                      <ArrowUpRightIcon className="size-3" />
                    </Link>
                  </MetaRow>
                </>
              )}
            </aside>
          </div>
        </section>

        {related.length > 0 && (
          <section
            data-pagefind-ignore="all"
            className="border-t border-border bg-muted/60"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                  Similar starters
                </h2>
                <Link
                  href="/"
                  className="text-sm text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                >
                  Browse all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((r) => (
                  <BoilerplateCard key={r.slug} b={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

function MetaRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
