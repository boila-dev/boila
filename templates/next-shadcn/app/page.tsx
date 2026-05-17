"use client"

import { CheckCircle2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const FEATURES = [
  "Next.js 15 App Router",
  "Tailwind CSS v4",
  "shadcn/ui (new-york style)",
  "next-themes for dark mode",
  "Geist sans + mono",
  "Sonner for toasts",
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-mono text-sm font-semibold tracking-tight">
          next-shadcn
        </span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-12 px-6 py-16">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Scaffolded with boila
          </span>
          <h1 className="text-5xl font-semibold leading-none tracking-tight md:text-6xl">
            Next + shadcn,
            <br />
            ready to ship.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            A minimal starter wired with Tailwind v4, shadcn/ui, and a clean
            theme toggle. Replace this page and start building.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 rounded-md border bg-card px-4 py-3 text-sm"
            >
              <CheckCircle2Icon className="size-4 text-muted-foreground" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => toast.success("Toasts are wired with sonner.")}
          >
            Trigger a toast
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://ui.shadcn.com/docs/components"
              target="_blank"
              rel="noreferrer"
            >
              Browse shadcn components
            </a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Add more components with{" "}
          <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
            pnpm dlx shadcn@latest add &lt;name&gt;
          </code>
          .
        </p>
      </main>

      <footer className="border-t px-6 py-4 text-xs text-muted-foreground">
        Built on Next.js {process.env.npm_package_dependencies_next ?? "15"}.
      </footer>
    </div>
  )
}
