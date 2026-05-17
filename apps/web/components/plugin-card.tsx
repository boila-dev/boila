import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"

import { STACK_LABELS } from "@/lib/boilerplates"
import {
  PLUGIN_CATEGORY_LABELS,
  type Plugin,
} from "@/lib/plugins"
import { StackIcon } from "./stack-icon"

export function PluginCard({ p }: { p: Plugin }) {
  return (
    <Link
      href={`/plugins/${p.slug}`}
      className="group/cardlink flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/40"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="coral">{PLUGIN_CATEGORY_LABELS[p.category]}</Badge>
          <ArrowUpRightIcon className="size-4 -translate-y-px text-muted-foreground transition-colors group-hover/cardlink:text-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xl leading-tight tracking-[-0.01em]">
            {p.name}
          </h3>
          <p className="text-sm text-muted-foreground">{p.description}</p>
        </div>
      </div>

      {p.compatibleStacks && p.compatibleStacks.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {p.compatibleStacks.slice(0, 4).map((s) => (
            <Badge key={s} variant="outline" className="gap-1.5">
              <StackIcon slug={s} />
              {STACK_LABELS[s] ?? s}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  )
}
