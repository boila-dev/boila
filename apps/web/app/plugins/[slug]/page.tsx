import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  PuzzleIcon,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import { BoilerplateCard } from "@/components/boilerplate-card"
import { GithubMark } from "@/components/icons"
import { MarkdownBody } from "@/components/markdown-body"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StackIcon } from "@/components/stack-icon"
import { STACK_LABELS } from "@/lib/boilerplates"
import { getPluginBody } from "@/lib/plugin-body"
import {
  PLUGIN_CATEGORY_LABELS,
  boilerplatesUsingPlugin,
  getPlugin,
  getPlugins,
  listPluginSlugs,
} from "@/lib/plugins"

export function generateStaticParams() {
  return listPluginSlugs().map((slug) => ({ slug }))
}

type Params = { slug: string }

export default async function PluginPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const p = getPlugin(slug)
  if (!p) notFound()
  const body = getPluginBody(slug)
  const { bundledIn, compatibleWith } = boilerplatesUsingPlugin(slug)
  const requires = getPlugins(p.requires)
  const conflicts = getPlugins(p.conflicts)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main data-pagefind-body>
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 pt-12 pb-20">
            <Link
              href="/plugins"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              All plugins
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Badge variant="coral">
                {PLUGIN_CATEGORY_LABELS[p.category]}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Added {formatDate(p.addedAt)}
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              {p.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {p.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline">
                <Link href={p.source.repo} target="_blank" rel="noreferrer">
                  <GithubMark className="mr-1 size-4" />
                  Plugin source
                  <ArrowUpRightIcon
                    data-icon="inline-end"
                    className="ml-1"
                  />
                </Link>
              </Button>
              {p.docs && (
                <Button asChild variant="ghost">
                  <Link href={p.docs} target="_blank" rel="noreferrer">
                    Upstream docs
                    <ArrowUpRightIcon
                      data-icon="inline-end"
                      className="ml-1"
                    />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-[1.6fr_1fr]">
            <article className="flex flex-col gap-6">
              {body && <MarkdownBody source={body} />}

              {p.env && p.env.length > 0 && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Environment variables
                  </h3>
                  <ul className="flex flex-col divide-y divide-border border-y border-border">
                    {p.env.map((env) => (
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

              {(requires.length > 0 || conflicts.length > 0) && (
                <div className="mt-8 flex flex-col gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Plugin relationships
                  </h3>
                  <ul className="flex flex-col gap-3 text-sm">
                    {requires.map((r) => (
                      <li
                        key={r.slug}
                        className="flex items-center gap-2"
                      >
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          Requires
                        </span>
                        <Link
                          href={`/plugins/${r.slug}`}
                          className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                        >
                          {r.name}
                        </Link>
                      </li>
                    ))}
                    {conflicts.map((c) => (
                      <li
                        key={c.slug}
                        className="flex items-center gap-2"
                      >
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          Conflicts with
                        </span>
                        <Link
                          href={`/plugins/${c.slug}`}
                          className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <aside className="flex flex-col gap-8 md:border-l md:border-border md:pl-10">
              {p.compatibleStacks && p.compatibleStacks.length > 0 && (
                <>
                  <MetaRow label="Targets">
                    <div className="flex flex-wrap gap-1.5">
                      {p.compatibleStacks.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="gap-1.5"
                        >
                          <StackIcon slug={s} />
                          {STACK_LABELS[s] ?? s}
                        </Badge>
                      ))}
                    </div>
                  </MetaRow>
                  <Separator />
                </>
              )}
              <MetaRow label="License">{p.license}</MetaRow>
              <Separator />
              <MetaRow label="Maintained">
                {p.maintained ? "Yes" : "No"}
              </MetaRow>
              <Separator />
              <MetaRow label="Authors">
                <div className="flex flex-col gap-1">
                  {p.authors.map((a) => (
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
              {p.postInstall && (
                <>
                  <Separator />
                  <MetaRow label="Post-install">
                    <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {p.postInstall}
                    </code>
                  </MetaRow>
                </>
              )}
              <Separator />
              <MetaRow label="Source folder">
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {p.source.subdir}
                </code>
              </MetaRow>
            </aside>
          </div>
        </section>

        {(bundledIn.length > 0 || compatibleWith.length > 0) && (
          <section
            data-pagefind-ignore="all"
            className="border-t border-border bg-muted/60"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20">
              {bundledIn.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <PuzzleIcon className="size-4 text-muted-foreground" />
                    <h2 className="font-display text-2xl leading-tight tracking-[-0.02em]">
                      Bundled in
                    </h2>
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      Already wired into these starters
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {bundledIn.map((b) => (
                      <BoilerplateCard key={b.slug} b={b} />
                    ))}
                  </div>
                </div>
              )}

              {compatibleWith.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <PuzzleIcon className="size-4 text-muted-foreground" />
                    <h2 className="font-display text-2xl leading-tight tracking-[-0.02em]">
                      Add it to
                    </h2>
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      Compatible starters you can opt into
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {compatibleWith.map((b) => (
                      <BoilerplateCard key={b.slug} b={b} />
                    ))}
                  </div>
                </div>
              )}
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
