import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

import { AnnouncementBar } from "./announcement-bar"
import { BoilaMark, GithubMark } from "./icons"
import { SearchCommand } from "./search-command"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <AnnouncementBar />
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <Link href="/" className="flex items-center gap-2">
            <BoilaMark className="size-7 text-primary" />
            <span className="font-display text-lg tracking-[-0.02em]">
              boila
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link
              href="/"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Catalog
            </Link>
            <Link
              href="/stacks"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Stacks
            </Link>
            <Link
              href="/use-cases"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Use cases
            </Link>
            <Link
              href="/plugins"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Plugins
            </Link>
            <Link
              href="/contribute"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Contribute
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <SearchCommand className="hidden lg:inline-flex" />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              asChild
              aria-label="GitHub repository"
            >
              <Link
                href="https://github.com/boila-dev/boila"
                target="_blank"
                rel="noreferrer"
              >
                <GithubMark />
              </Link>
            </Button>
            <Button size="sm" asChild className="ml-1 hidden md:inline-flex">
              <Link href="/contribute">Submit a boilerplate</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
