import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

/*
 * Cohere card system (per DESIGN.md):
 *  - Default cards are FLAT — no shadow, no ring chrome. Depth comes from
 *    surface alternation (canvas vs stone vs deep-green).
 *  - `variant` picks the surface; `size` picks the radius + padding.
 *  - The signature hero-photo-card lands on `rounded-2xl` (=22px) thanks to
 *    the Cohere-tuned radius scale in globals.css.
 */
const cardVariants = cva(
  "group/card flex flex-col gap-6 overflow-hidden text-card-foreground has-[>img:first-child]:pt-0",
  {
    variants: {
      variant: {
        default: "bg-card",
        bordered: "bg-card border border-border",
        stone: "bg-brand-stone text-brand-ink",
        "pale-green": "bg-brand-pale-green text-brand-ink",
        "pale-blue": "bg-brand-pale-blue text-brand-ink",
        dark: "bg-brand-deep-green text-brand-canvas",
        navy: "bg-brand-dark-navy text-brand-canvas",
      },
      size: {
        default: "rounded-2xl py-6",
        sm: "rounded-md gap-4 py-4",
        lg: "rounded-2xl py-8",
        flush: "rounded-none py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Card({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(
        cardVariants({ variant, size }),
        "*:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl group-data-[size=sm]/card:*:[img:first-child]:rounded-t-md group-data-[size=sm]/card:*:[img:last-child]:rounded-b-md",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-2xl leading-tight font-normal tracking-[-0.01em]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-8",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-8 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
