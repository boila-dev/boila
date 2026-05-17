# CLAUDE.md

## Project: Boila

Community-curated registry of boilerplates **and composable plugins**. Devs browse the catalog on a Next.js site, pick a base starter, optionally toggle add-on plugins (auth, payments, email, analytics…), and scaffold the whole thing via a single `npx @boila/cli` command. Two surfaces (web + CLI), one source of truth (MDX files in this repo).

## North star

- **One CLI, one registry, plus plugins.** Pick a base, check the boxes for the add-ons you want, ship.
- **Curation > exhaustivity.** Every boilerplate and every plugin is reviewed before merging.
- **Indexed by use case** (SaaS, landing, monorepo, API…) and by stack.
- **Static site, no backend, no auth.** All contributions go through GitHub PRs.

## Stack

- **Next.js 15** (App Router, mostly static / ISR)
- **TypeScript**, strict mode
- **MDX** for boilerplate and plugin entries (frontmatter + rich body)
- **shadcn/ui** + **Tailwind CSS** — do not install other UI libraries
- **Pagefind** for client-side search (built at deploy time)
- **Vercel** for hosting + analytics
- **giget** under the hood in the CLI to clone repos and plugin sources
- **pnpm workspaces** for the monorepo (web + cli share the registry)

### Not used — do not add without an explicit reason

No backend service, no database, no auth (no Appwrite, no Better-auth, no Supabase), no tRPC, no Algolia, no Zustand/Redux. The registry is just files. Favorites can live in `localStorage` if needed.

## Repo structure

```
.
├── apps/
│   └── web/                       # Next.js site
│       ├── app/                   # routes (App Router)
│       ├── components/            # shared components
│       └── content/
│           ├── boilerplates/      # MDX entries, one per boilerplate
│           └── plugins/           # MDX entries, one per plugin
├── packages/
│   └── cli/                       # `@boila/cli` npm package
│       └── src/
├── templates/                     # actual source for every boilerplate + plugin
│   ├── <boilerplate-slug>/        # one folder per base (Next, Vite, Astro…)
│   └── _plugins/
│       └── <plugin-slug>/         # drop-in plugin files
├── scripts/
│   └── build-registry.ts          # MDX → public/registry.json
├── registry.schema.json           # JSON schema for boilerplate frontmatter
├── plugin.schema.json             # JSON schema for plugin frontmatter
└── README.md
```

Templates are *not* npm workspaces. They are standalone projects that ship as-is — installing the monorepo never pulls their deps.

## Registry format

### Boilerplate (base)

`apps/web/content/boilerplates/<slug>.mdx`:

```yaml
---
slug: t3-saas-starter
name: T3 SaaS Starter
description: One-line pitch, max 120 chars.
repo: https://github.com/<owner>/<repo>
branch: main             # optional, defaults to main
subdir: ""               # optional, for monorepos
stack: [next, typescript, tailwind, prisma, trpc]
useCases: [saas, dashboard]
features: [auth, payments, emails]
bundledPlugins: [auth-clerk, db-prisma]      # already in the base
compatiblePlugins: [stripe, resend, posthog] # can be added at scaffold time
authors: [github-handle]
maintained: true
license: MIT
demo: https://...        # optional
preview: /previews/t3-saas.png # optional, 1200x630
addedAt: 2026-05-17
---
## Why this boilerplate

Markdown body explaining tradeoffs, what's included, what's not.
```

### Plugin (composable add-on)

`apps/web/content/plugins/<slug>.mdx`:

```yaml
---
slug: stripe
name: Stripe billing
description: One-line pitch, max 120 chars.
category: payments       # auth | payments | email | analytics | db | monitoring | observability | ui | misc
compatibleStacks: [next, remix]    # which stacks the plugin targets
requires: [auth-clerk]   # other plugin slugs that must be present
conflicts: [lemonsqueezy]
env: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET]
source:
  repo: https://github.com/boila-dev/plugins
  branch: main           # optional
  subdir: stripe         # folder inside the plugins repo
postInstall: pnpm db:push
authors: [github-handle]
maintained: true
license: MIT
addedAt: 2026-05-17
---
## What it adds

Markdown body explaining the routes, files, env vars, gotchas.
```

The MDX body powers the detail page. Frontmatter feeds the CLI picker and the filter UI on the listing pages.

## CLI behavior

```
npx @boila/cli                          → interactive picker (base then plugins)
npx @boila/cli <slug>                   → scaffold a known boilerplate (still prompts for plugins)
npx @boila/cli <slug> <dir>             → scaffold into a specific directory
npx @boila/cli <slug> --with a,b,c      → non-interactive plugin selection
npx @boila/cli <slug> --bare            → skip plugin prompt, base only
npx @boila/cli search <term>            → filter boilerplates from the terminal
npx @boila/cli plugins                  → list available plugins (and filter with --category)
```

Under the hood:

1. Fetch `https://boila.dev/registry.json` (generated at build time from MDX). Single document with both `boilerplates` and `plugins` arrays.
2. Resolve slug → repo URL + branch + subdir.
3. `giget` clones the base into the target directory.
4. For each selected plugin: `giget` clones the plugin source `subdir` and **drops the files in place** (drop-in, no patching). Plugins must not collide on file paths.
5. Resolve `requires` (auto-add prerequisites) and warn on `conflicts`.
6. Consolidate `env` vars into `.env.example`, run `postInstall` commands in order.
7. Print post-scaffold instructions from the base and each plugin entry.

### Local dev override

When `BOILA_TEMPLATES_DIR` is set, the CLI bypasses giget and copies from a local folder. The dev script (`pnpm --filter cli dev`) wires this automatically so you can iterate on `templates/` without pushing to GitHub. Layout: `${BOILA_TEMPLATES_DIR}/<slug>` for boilerplates, `${BOILA_TEMPLATES_DIR}/_plugins/<slug>` for plugins.

## Conventions

- TypeScript strict, no `any` unless justified inline.
- Server Components by default; mark `"use client"` only when truly needed.
- File names: kebab-case for routes, PascalCase for components.
- Components live in `apps/web/components/`; colocate route-only ones under `app/`.
- Use shadcn primitives. If a primitive doesn't exist, build it with Tailwind — don't add another UI lib.
- URL state via search params for filters (so links are shareable).
- No client-side state libs for the MVP. React state + URL params is enough.
- Tailwind classes ordered by Tailwind's `prettier-plugin-tailwindcss`.

## Commands

- `pnpm dev` — run the web app
- `pnpm build` — generate `registry.json`, build the web app, run Pagefind
- `pnpm --filter cli build` — build the CLI
- `pnpm --filter cli dev <slug>` — test the CLI locally against a built registry
- `pnpm lint` — ESLint + Prettier
- `pnpm registry:validate` — validate every boilerplate and plugin MDX against its schema
- `pnpm smoke` — scaffold every combo (base / base+plugins), install, typecheck. Catches base-vs-plugin breakage locally.
- `pnpm smoke:build` — same but runs the full `next build` instead of `tsc --noEmit`. Slower, used by the weekly CI cron.

## Contribution flow

### Adding a boilerplate

1. Fork the repo
2. Add `apps/web/content/boilerplates/<your-slug>.mdx`
3. Run `pnpm registry:validate` locally
4. Open a PR. Acceptance checks:
   - Repo is public and maintained (commit within the last 6 months)
   - Install + run works from a clean clone
   - Not a duplicate of an existing entry (intent matters more than stack)
   - License is permissive (MIT, Apache, ISC, BSD)
   - `description` is one line and not marketing-y

### Adding a plugin

1. Fork the repo
2. Add `apps/web/content/plugins/<your-slug>.mdx`
3. Add the actual plugin source under the canonical `boila-dev/plugins` repo (separate PR or coordinate)
4. Run `pnpm registry:validate` locally
5. Open a PR. Acceptance checks (same bar as boilerplates plus):
   - Drop-in: no file conflicts with any boilerplate that lists it as `compatible`
   - `requires` / `conflicts` accurately reflect real dependencies
   - `env` lists every required environment variable

CI runs `pnpm registry:validate` and a link checker on every PR.

## What NOT to do

- Don't add a backend service, DB, or auth provider. The registry is files.
- Don't add a web submission form. PRs are the curation gate.
- Don't reach for a 3rd-party UI lib outside shadcn.
- Don't fetch the registry at runtime in the web app — it's read at build time.
- Don't hardcode boilerplate or plugin URLs in the CLI — everything resolves through the registry.
- Don't introduce a codemod / AST-patching plugin system. Plugins are drop-in folders. If a future plugin really needs patching, we revisit explicitly.

## Out of scope for v1

- User accounts / synced favorites
- Comments, votes, ratings
- Update notifications
- StackBlitz / CodeSandbox live previews (nice-to-have for v2)
- Auto-scraping boilerplates from GitHub (curation is the moat)
- Codemod-based plugin patching (drop-in only for v1)

## Useful context for refactors

- The CLI must stay dependency-light (target install < 1 MB). Prefer Node built-ins.
- `registry.json` is the public contract — versioning matters if its shape changes. Today it ships `{ version, generatedAt, boilerplates, plugins }`.
- The detail page URL patterns (`/<slug>` for boilerplates, `/plugins/<slug>` for plugins) are part of the public surface and show up in CLI output. Don't change them without a redirect.
- When touching a `templates/<slug>/` boilerplate or a `templates/_plugins/<slug>/` plugin, run `pnpm smoke` locally before pushing. CI runs it on every PR (typecheck) and weekly (full build) — the weekly cron is what catches upstream rot (Next/Tailwind/Better Auth shipping a breaking change).

## Dependency updates (Renovate)

`renovate.json` drives all dep bumps. Rules:

- **Schedule**: Renovate opens PRs Monday morning Paris time. Concurrent limit 10, hourly limit 4 — won't flood the queue.
- **Grouping**: each `templates/<slug>/` PR is one boilerplate at a time (smoke test scope stays small). Workspaces share grouping by ecosystem (Next.js, React, Tailwind, shadcn/Radix, better-auth+drizzle).
- **Auto-merge**: patch + minor for templates (gated by the smoke workflow), patch only for workspaces. Majors **always** need human review (labeled `major-bump`).
- **Dashboard**: the `Dependency Dashboard` GitHub issue lists every pending update. Use it instead of hunting through the PR queue.
- **Engines** (Node version, npm version) are ignored — they're a floor, not a target. Bump them manually when raising the minimum supported runtime.
