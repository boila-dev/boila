import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

/*
 * Cohere badge / chip system (per DESIGN.md):
 *  - default / secondary -> baseline shadcn semantics, Cohere-tuned.
 *  - coral               -> editorial taxonomy chip (blog filter).
 *  - coral-outline       -> inactive taxonomy chip.
 *  - mono                -> uppercase mono label for technical markers.
 *  - outline-pill        -> research / topic filter pill.
 */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "rounded-md bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "rounded-md bg-secondary text-secondary-foreground [a]:hover:bg-secondary/70",
        destructive:
          "rounded-md bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "rounded-md border-border bg-transparent text-foreground [a]:hover:bg-muted",
        ghost:
          "rounded-md hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link: "rounded-none text-brand-action-blue underline-offset-4 hover:underline",
        // Editorial chips — Cohere blog/research taxonomy.
        coral:
          "rounded-md bg-brand-coral text-brand-ink [a]:hover:bg-brand-coral/85",
        "coral-outline":
          "rounded-md border-brand-coral bg-transparent text-brand-coral [a]:hover:bg-brand-coral/10",
        "outline-pill":
          "rounded-4xl border-foreground/30 bg-transparent text-foreground [a]:hover:bg-foreground/5",
        mono: "rounded-none border-0 bg-transparent px-0 font-mono uppercase tracking-[0.02em] text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
