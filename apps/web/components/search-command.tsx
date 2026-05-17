"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRightIcon, SearchIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { cn } from "@workspace/ui/lib/utils"

import { BOILERPLATES, type Boilerplate } from "@/lib/boilerplates"
import { StackIcon } from "./stack-icon"

/*
 * Global search palette. Pagefind powers full-text search across the
 * static detail pages (`apps/web/app/[slug]/page.tsx`, annotated with
 * `data-pagefind-body`). The index lives at /pagefind/pagefind.js,
 * generated at build time by `pagefind --site out`.
 *
 * Dev fallback: when the index is missing (i.e. running `next dev`,
 * where Pagefind hasn't built yet), we fall back to a light substring
 * match against the in-memory registry. Same UX, weaker matching.
 */

type Hit = {
  url: string
  excerpt: string
  meta: {
    title?: string
    slug?: string
    description?: string
  }
}

type PagefindApi = {
  options: (opts: Record<string, unknown>) => Promise<void>
  init: () => void
  search: (q: string) => Promise<{
    results: Array<{ data: () => Promise<Hit> }>
  }>
} | null

export function SearchCommand({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [hits, setHits] = React.useState<Hit[]>([])
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<"pagefind" | "fallback" | "loading">(
    "loading"
  )
  const pagefindRef = React.useRef<PagefindApi>(null)

  // Cmd/Ctrl + K → open
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Lazy-load the Pagefind bundle the first time the palette opens.
  React.useEffect(() => {
    if (!open || pagefindRef.current !== null || mode === "fallback") return
    let cancelled = false
    ;(async () => {
      try {
        // Dynamic import from the static index; ignored by webpack.
        // @ts-expect-error — runtime import path, no module types.
        const mod = (await import(/* webpackIgnore: true */ "/pagefind/pagefind.js")) as PagefindApi
        if (cancelled || !mod) return
        await mod.options({ excerptLength: 24 })
        mod.init()
        pagefindRef.current = mod
        setMode("pagefind")
      } catch {
        if (!cancelled) setMode("fallback")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, mode])

  // Debounced query → results
  React.useEffect(() => {
    if (!open) return
    const term = query.trim()
    if (!term) {
      setHits([])
      setLoading(false)
      return
    }
    setLoading(true)
    const handle = setTimeout(async () => {
      if (mode === "pagefind" && pagefindRef.current) {
        const search = await pagefindRef.current.search(term)
        const top = await Promise.all(
          search.results.slice(0, 8).map((r) => r.data())
        )
        setHits(top)
      } else if (mode === "fallback") {
        setHits(fallbackSearch(term))
      }
      setLoading(false)
    }, 150)
    return () => clearTimeout(handle)
  }, [query, open, mode])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 gap-3 rounded-md border-border bg-card pr-1.5 pl-3 text-muted-foreground hover:text-foreground",
          className
        )}
        aria-label="Open search"
      >
        <SearchIcon className="size-4" />
        <span className="hidden text-sm sm:inline">Search starters…</span>
        <kbd className="hidden items-center gap-0.5 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the catalog"
        description="Find a boilerplate by name, stack, or body content."
        className="overflow-hidden rounded-2xl! p-0 sm:max-w-xl"
      >
        <CommandPalette
          query={query}
          setQuery={setQuery}
          hits={hits}
          loading={loading}
          mode={mode}
          onSelect={() => setOpen(false)}
        />
      </CommandDialog>
    </>
  )
}

function CommandPalette({
  query,
  setQuery,
  hits,
  loading,
  mode,
  onSelect,
}: {
  query: string
  setQuery: (v: string) => void
  hits: Hit[]
  loading: boolean
  mode: "pagefind" | "fallback" | "loading"
  onSelect: () => void
}) {
  const router = useRouter()
  return (
    <Command shouldFilter={false} className="rounded-2xl">
      <CommandInput
        placeholder="Search by name, stack, or body content…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-96">
        {!query && (
          <CommandEmpty className="px-6 py-10 text-left text-sm text-muted-foreground">
            <span className="block font-mono text-xs uppercase tracking-[0.08em]">
              Try a search
            </span>
            <span className="mt-2 block">
              e.g.{" "}
              <kbd className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                stripe
              </kbd>
              ,{" "}
              <kbd className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                edge
              </kbd>
              , or{" "}
              <kbd className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                turborepo
              </kbd>
              .
            </span>
          </CommandEmpty>
        )}
        {query && !loading && hits.length === 0 && (
          <CommandEmpty>No matching boilerplate.</CommandEmpty>
        )}
        {hits.length > 0 && (
          <CommandGroup
            heading={mode === "fallback" ? "Quick filter (dev)" : "Boilerplates"}
          >
            {hits.map((hit) => {
              const slug =
                hit.meta.slug ??
                hit.url.replace(/\/$/, "").split("/").pop() ??
                ""
              const b = BOILERPLATES.find((x) => x.slug === slug)
              return (
                <CommandItem
                  key={hit.url}
                  value={hit.url}
                  onSelect={() => {
                    router.push(`/${slug}`)
                    onSelect()
                  }}
                  className="items-start gap-3"
                >
                  <div className="mt-0.5 flex shrink-0 items-center gap-1">
                    {b?.stack.slice(0, 2).map((s) => (
                      <StackIcon
                        key={s}
                        slug={s}
                        className="size-4 text-muted-foreground"
                      />
                    ))}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-display text-sm tracking-[-0.01em]">
                      {hit.meta.title ?? slug}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      <HighlightedExcerpt excerpt={hit.excerpt} />
                    </span>
                  </div>
                  <ArrowUpRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
      {mode === "fallback" && (
        <div className="border-t border-border bg-muted/40 px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          Pagefind index not built — using in-memory fallback
        </div>
      )}
    </Command>
  )
}

/*
 * Safely render a Pagefind excerpt. Excerpts arrive HTML-escaped with
 * literal <mark> tags around matches; we split on the tag boundary and
 * render <mark> as a React element so user text is never injected raw.
 */
function HighlightedExcerpt({ excerpt }: { excerpt: string }) {
  const parts: React.ReactNode[] = []
  let cursor = 0
  let key = 0
  for (const match of excerpt.matchAll(/<mark>([\s\S]*?)<\/mark>/g)) {
    const start = match.index ?? 0
    if (start > cursor) {
      parts.push(decodeEntities(excerpt.slice(cursor, start)))
    }
    parts.push(
      <mark
        key={key++}
        className="rounded-sm bg-brand-coral/20 px-0.5 text-foreground"
      >
        {decodeEntities(match[1] ?? "")}
      </mark>
    )
    cursor = start + match[0].length
  }
  if (cursor < excerpt.length) {
    parts.push(decodeEntities(excerpt.slice(cursor)))
  }
  return <>{parts}</>
}

const ENTITY_RE = /&(amp|lt|gt|quot|#39|#x27);/g
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  "#x27": "'",
}
function decodeEntities(s: string) {
  return s.replace(ENTITY_RE, (_, name: string) => ENTITIES[name] ?? "")
}

/*
 * Light substring search used when Pagefind isn't available (typically
 * `next dev` before a build, or production if Pagefind failed to run).
 * Searches frontmatter only — the MDX body lives server-side, so it's
 * out of reach here. Pagefind covers body matches in production.
 */
function fallbackSearch(term: string): Hit[] {
  const q = term.toLowerCase()
  const hits: { b: Boilerplate; score: number; hayIndex: number }[] = []
  for (const b of BOILERPLATES) {
    const hay =
      `${b.name} ${b.description} ${b.stack.join(" ")} ${b.useCases.join(" ")}`.toLowerCase()
    const i = hay.indexOf(q)
    if (i === -1) continue
    hits.push({
      b,
      score: i + (b.name.toLowerCase().includes(q) ? 0 : 1000),
      hayIndex: i,
    })
  }
  hits.sort((a, b) => a.score - b.score)
  return hits.slice(0, 8).map(({ b }) => {
    const lowerDesc = b.description.toLowerCase()
    const i = lowerDesc.indexOf(q)
    const excerpt =
      i >= 0 ? buildExcerpt(b.description, i, q.length) : b.description
    return {
      url: `/${b.slug}/`,
      excerpt,
      meta: {
        title: b.name,
        slug: b.slug,
        description: b.description,
      },
    }
  })
}

function buildExcerpt(text: string, index: number, len: number) {
  const radius = 60
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + len + radius)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < text.length ? "…" : ""
  // The HighlightedExcerpt parser expects HTML-escaped text with <mark>
  // wrappers, matching Pagefind's excerpt format exactly.
  const before = escapeHtml(text.slice(start, index))
  const target = escapeHtml(text.slice(index, index + len))
  const after = escapeHtml(text.slice(index + len, end))
  return `${prefix}${before}<mark>${target}</mark>${after}${suffix}`
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
