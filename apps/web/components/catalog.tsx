"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

import { BOILERPLATES, type UseCase } from "@/lib/boilerplates"
import { BoilerplateCard } from "./boilerplate-card"

export function Catalog() {
  const params = useSearchParams()
  const useCase = (params.get("useCase") as UseCase | null) ?? null
  const stack = params.get("stack")
  const q = params.get("q")?.toLowerCase().trim() ?? ""

  const filtered = useMemo(() => {
    return BOILERPLATES.filter((b) => {
      if (useCase && !b.useCases.includes(useCase)) return false
      if (stack && !b.stack.includes(stack)) return false
      if (q) {
        const hay = `${b.name} ${b.description} ${b.stack.join(" ")}`
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [useCase, stack, q])

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
        <p className="font-display text-2xl tracking-[-0.01em]">
          Nothing matches that filter yet.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a broader use case — or open a PR to add a matching boilerplate.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((b) => (
        <BoilerplateCard key={b.slug} b={b} />
      ))}
    </div>
  )
}
