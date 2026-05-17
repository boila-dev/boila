import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { BOILERPLATES } from "@/lib/boilerplates"

export const metadata = {
  title: "Changelog",
  description: "When entries land in the registry.",
}

type ChangelogEntry = {
  date: string
  type: "added" | "shipped"
  title: string
  slug?: string
  body: string
}

/*
 * Manual milestones for the project itself. Entries from the registry
 * are appended automatically (one row per boilerplate, dated `addedAt`).
 */
const PROJECT_MILESTONES: ChangelogEntry[] = [
  {
    date: "2026-05-17",
    type: "shipped",
    title: "v1 ships",
    body: "Public catalog, search palette via Pagefind, MDX pipeline with schema validation, and the `npx boila` CLI.",
  },
  {
    date: "2026-04-02",
    type: "shipped",
    title: "Curation guidelines",
    body: "Explicit accept/reject rules so contributors know what to send before opening a PR.",
  },
  {
    date: "2026-03-12",
    type: "shipped",
    title: "Repository public",
    body: "Boila opens to community contributions.",
  },
]

export default function ChangelogPage() {
  const registryEntries: ChangelogEntry[] = BOILERPLATES.map((b) => ({
    date: b.addedAt,
    type: "added",
    title: b.name,
    slug: b.slug,
    body: b.description,
  }))

  const all = [...PROJECT_MILESTONES, ...registryEntries].sort((a, b) =>
    b.date.localeCompare(a.date)
  )

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 pt-16 pb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Changelog
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              Every entry, every ship.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Project milestones land here manually. Registry entries are
              appended automatically from each MDX file's{" "}
              <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                addedAt
              </code>{" "}
              field.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {all.map((entry, i) => (
              <li
                key={`${entry.date}-${entry.slug ?? entry.title}-${i}`}
                className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[140px_120px_1fr] md:items-baseline md:gap-6"
              >
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {formatDate(entry.date)}
                </span>
                <span
                  className={
                    entry.type === "shipped"
                      ? "font-mono text-xs uppercase tracking-[0.08em] text-brand-coral"
                      : "font-mono text-xs uppercase tracking-[0.08em] text-brand-action-blue"
                  }
                >
                  {entry.type === "shipped" ? "Shipped" : "New entry"}
                </span>
                <div className="flex flex-col gap-1">
                  {entry.slug ? (
                    <a
                      href={`/${entry.slug}`}
                      className="font-display text-lg leading-tight tracking-[-0.01em] underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <h2 className="font-display text-lg leading-tight tracking-[-0.01em]">
                      {entry.title}
                    </h2>
                  )}
                  <p className="text-sm text-muted-foreground">{entry.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
