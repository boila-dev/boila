import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export function AnnouncementBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center justify-center gap-2 bg-brand-cohere-black px-4 text-xs text-white",
        className
      )}
    >
      <span className="font-mono uppercase tracking-[0.08em] text-white/60">
        v1
      </span>
      <span className="hidden sm:inline">
        Curated boilerplates, one CLI command —
      </span>
      <span className="sm:hidden">One CLI, all the boilerplates —</span>
      <Link
        href="/about"
        className="inline-flex items-center gap-1 underline underline-offset-4 decoration-white/40 hover:decoration-white"
      >
        Read the manifesto
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  )
}
