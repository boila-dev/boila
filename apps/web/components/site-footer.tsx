import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

/*
 * Cohere `footer-newsletter` analogue, theme-adaptive.
 *  - Light: warm stone surface with ink text — matches the soft-stone
 *    bands Cohere uses on calmer pages.
 *  - Dark: lifted neutral card surface (--card) above the near-black
 *    page background.
 * No hardcoded white/black — every color flows through semantic tokens
 * so the footer flips with the theme.
 */
export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-muted text-foreground dark:bg-card">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-coral">
            Frameworks move fast
          </span>
          <h2 className="font-display text-3xl leading-tight tracking-[-0.01em]">
            New starters every week.
            <br />
            One inbox.
          </h2>
          <form className="flex max-w-md items-center gap-0 border-b border-border pb-2">
            <Input
              type="email"
              placeholder="you@studio.dev"
              className="h-9 flex-1 rounded-none border-0 bg-transparent px-0 text-base focus-visible:ring-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              aria-label="Subscribe"
            >
              <ArrowRightIcon />
            </Button>
          </form>
          <p className="max-w-md text-xs text-muted-foreground">
            No spam. Just curated new entries and the occasional teardown.
          </p>
        </div>

        <FooterColumn
          label="Browse"
          links={[
            { href: "/", label: "Catalog" },
            { href: "/stacks", label: "Stacks" },
            { href: "/use-cases", label: "Use cases" },
            { href: "/maintained", label: "Maintained" },
          ]}
        />
        <FooterColumn
          label="Contribute"
          links={[
            { href: "/contribute", label: "Submit a boilerplate" },
            { href: "/guidelines", label: "Curation guidelines" },
            {
              href: "https://github.com/boila-dev/boila",
              label: "GitHub",
            },
          ]}
        />
        <FooterColumn
          label="Project"
          links={[
            { href: "/about", label: "Manifesto" },
            { href: "/changelog", label: "Changelog" },
            { href: "/license", label: "License" },
          ]}
        />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Boila. MIT licensed.</span>
          <span className="font-mono uppercase tracking-[0.08em]">
            npx @boila/cli &lt;slug&gt;
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  label,
  links,
}: {
  label: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm text-foreground">{label}</span>
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
