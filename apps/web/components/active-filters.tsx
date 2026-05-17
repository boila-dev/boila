"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { XIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

import { STACK_LABELS } from "@/lib/boilerplates"

import { StackIcon } from "./stack-icon"

/*
 * Render removable chips for any non-`useCase` URL filters currently
 * active (stack, search query). `useCase` is owned by `TaxonomyChips`,
 * so it stays out of here to avoid double UI.
 */
export function ActiveFilters({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const stack = params.get("stack")
  const q = params.get("q")?.trim()

  const clear = (key: "stack" | "q") => {
    const next = new URLSearchParams(params.toString())
    next.delete(key)
    const qs = next.toString()
    router.replace(qs ? `/?${qs}#catalog` : `/#catalog`, { scroll: false })
  }

  if (!stack && !q) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        Filtered by
      </span>
      {stack && (
        <FilterChip onRemove={() => clear("stack")}>
          <StackIcon slug={stack} />
          {STACK_LABELS[stack] ?? stack}
        </FilterChip>
      )}
      {q && (
        <FilterChip onRemove={() => clear("q")}>
          <span className="font-mono">{q}</span>
        </FilterChip>
      )}
    </div>
  )
}

function FilterChip({
  children,
  onRemove,
}: {
  children: React.ReactNode
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card py-1 pr-1 pl-2.5 text-xs">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <XIcon className="size-3" />
      </button>
    </span>
  )
}
