"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import type { UseCase } from "@/lib/boilerplates"
import { USE_CASES, USE_CASE_LABELS } from "@/lib/boilerplates"

export function TaxonomyChips() {
  const router = useRouter()
  const params = useSearchParams()
  const active = (params.get("useCase") as UseCase | null) ?? null

  const setUseCase = (uc: UseCase | null) => {
    const next = new URLSearchParams(params.toString())
    if (uc) next.set("useCase", uc)
    else next.delete("useCase")
    const qs = next.toString()
    router.replace(qs ? `/?${qs}#catalog` : `/#catalog`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip active={active === null} onClick={() => setUseCase(null)}>
        All
      </Chip>
      {USE_CASES.map((uc) => (
        <Chip
          key={uc}
          active={active === uc}
          onClick={() => setUseCase(uc)}
        >
          {USE_CASE_LABELS[uc]}
        </Chip>
      ))}
    </div>
  )
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={cn(
        "inline-flex h-9 items-center rounded-4xl border px-4 font-display text-base tracking-[-0.01em] transition-colors",
        active
          ? "border-brand-coral bg-brand-coral text-brand-ink"
          : "border-brand-coral/60 bg-transparent text-brand-coral hover:bg-brand-coral/10"
      )}
    >
      {children}
    </button>
  )
}
