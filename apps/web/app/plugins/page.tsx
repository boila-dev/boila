import { PuzzleIcon } from "lucide-react"

import { PluginCard } from "@/components/plugin-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PLUGINS, pluginsByCategory } from "@/lib/plugins"

export const metadata = {
  title: "Plugins",
  description:
    "Compose any boilerplate with optional add-ons — auth, payments, email, analytics, and more.",
}

export default function PluginsPage() {
  const groups = pluginsByCategory()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Plugins
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Pick a base.
              <br />
              Check the boxes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Plugins are drop-in folders that the CLI applies on top of a
              boilerplate at scaffold time. {PLUGINS.length} available across{" "}
              {groups.length} categor{groups.length === 1 ? "y" : "ies"}.
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16">
          {groups.map((g) => (
            <div key={g.category} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <PuzzleIcon className="size-4 text-muted-foreground" />
                <h2 className="font-display text-2xl leading-tight tracking-[-0.02em]">
                  {g.label}
                </h2>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {g.plugins.length} plugin
                  {g.plugins.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {g.plugins.map((p) => (
                  <li key={p.slug}>
                    <PluginCard p={p} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
