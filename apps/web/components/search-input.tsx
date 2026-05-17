"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

/*
 * Catalog search — pure URL state. Debounces the param write so typing
 * doesn't thrash history, then `Catalog` re-renders on `?q=` change.
 */
export function SearchInput({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get("q") ?? ""
  const [value, setValue] = React.useState(initial)

  // Keep local input in sync if the URL changes from elsewhere (e.g. chip click).
  React.useEffect(() => {
    setValue(initial)
  }, [initial])

  React.useEffect(() => {
    const trimmed = value.trim()
    const current = params.get("q") ?? ""
    if (trimmed === current) return
    const handle = setTimeout(() => {
      const next = new URLSearchParams(params.toString())
      if (trimmed) next.set("q", trimmed)
      else next.delete("q")
      const qs = next.toString()
      router.replace(qs ? `/?${qs}#catalog` : `/#catalog`, { scroll: false })
    }, 200)
    return () => clearTimeout(handle)
  }, [value, params, router])

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, stack, or use case…"
        className="pl-9"
        aria-label="Search the catalog"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}
