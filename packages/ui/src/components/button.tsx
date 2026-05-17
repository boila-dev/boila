import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

/*
 * Cohere button system (per DESIGN.md):
 *  - primary      -> near-black pill CTA, 32px radius, 14px medium label.
 *  - secondary    -> text-only underlined link, no background, no border.
 *  - outline      -> outlined pill (transparent fill, 1px dark border).
 *  - ghost / destructive / link -> kept for shadcn parity (menus, errors, inline).
 *
 * Pill radius is driven by `rounded-4xl` because the global radius scale is
 * tuned to land 4xl on 32px (Cohere CTA pill).
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-sans text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-4xl bg-primary text-primary-foreground hover:bg-primary/85",
        secondary:
          "rounded-none border-0 px-0! py-0! h-auto! gap-0 font-normal text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground",
        outline:
          "rounded-4xl border-foreground/80 bg-transparent text-foreground hover:bg-foreground/5",
        ghost:
          "rounded-md hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "rounded-none h-auto! px-0! text-brand-action-blue underline-offset-4 hover:underline",
        // Inverted pill for dark product bands (e.g. deep-green / dark-navy
        // sections). Matches Cohere's CTA placement on dark surfaces.
        "primary-on-dark":
          "rounded-4xl bg-brand-canvas text-brand-primary hover:bg-brand-canvas/90",
      },
      size: {
        default:
          "h-10 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "h-7 gap-1 px-3 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-12 gap-2 px-7 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
