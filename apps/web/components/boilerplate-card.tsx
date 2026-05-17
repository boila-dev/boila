import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"

import type { Boilerplate } from "@/lib/boilerplates"
import { STACK_LABELS, USE_CASE_LABELS } from "@/lib/boilerplates"
import { StackIcon } from "./stack-icon"

export function BoilerplateCard({ b }: { b: Boilerplate }) {
  return (
    <Link
      href={`/${b.slug}`}
      className="group/cardlink flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/40"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {b.useCases.slice(0, 1).map((u) => (
              <Badge key={u} variant="coral">
                {USE_CASE_LABELS[u]}
              </Badge>
            ))}
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              {b.maintained ? "Maintained" : "Archived"}
            </span>
          </div>
          <ArrowUpRightIcon className="size-4 -translate-y-px text-muted-foreground transition-colors group-hover/cardlink:text-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl leading-tight tracking-[-0.01em]">
            {b.name}
          </h3>
          <p className="text-sm text-muted-foreground">{b.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {b.stack.slice(0, 4).map((s) => (
          <Badge key={s} variant="outline" className="gap-1.5">
            <StackIcon slug={s} />
            {STACK_LABELS[s] ?? s}
          </Badge>
        ))}
        {b.stack.length > 4 && (
          <span className="text-xs text-muted-foreground">
            +{b.stack.length - 4}
          </span>
        )}
      </div>
    </Link>
  )
}
