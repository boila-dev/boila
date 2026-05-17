# Boila

[![Smoke](https://github.com/boila-dev/boila/actions/workflows/smoke.yml/badge.svg)](https://github.com/boila-dev/boila/actions/workflows/smoke.yml)
[![Registry](https://github.com/boila-dev/boila/actions/workflows/registry.yml/badge.svg)](https://github.com/boila-dev/boila/actions/workflows/registry.yml)
[![npm version](https://img.shields.io/npm/v/boila.svg)](https://www.npmjs.com/package/boila)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Pick a base. Toggle add-ons. Ship.

Boila is a curated registry of frontend / full-stack boilerplates **and composable plugins**. Browse the catalog at [boila.dev](https://boila.dev), then scaffold any combo with one command:

```bash
npx boila                              # interactive: pick a base, check the plugins
npx boila next-shadcn                  # known base, still prompts for plugins
npx boila next-shadcn --with better-auth my-app
npx boila next-shadcn --bare           # base only
```

Two surfaces (web + CLI), one source of truth (MDX files in this repo).

## North star

- **One CLI, one registry, plus plugins.** No more memorising `create-this`, `create-that`, then wiring auth/payments/email by hand.
- **Curation > exhaustivity.** Every boilerplate and every plugin is reviewed before merging.
- **Indexed by use case** (SaaS, landing, monorepo, API…) and by stack.
- **Static site, no backend, no auth.** All contributions go through GitHub PRs.

## Repo layout

```
.
├── apps/
│   └── web/                          # Next.js site (static export)
│       ├── app/                      # App Router pages
│       ├── components/               # site-level UI
│       └── content/
│           ├── boilerplates/         # MDX entries — boilerplate metadata
│           └── plugins/              # MDX entries — plugin metadata
├── packages/
│   ├── cli/                          # `boila` npm package
│   └── ui/                           # shared shadcn/ui workspace package
├── templates/                        # actual source for boilerplates + plugins
│   ├── <boilerplate-slug>/           # one folder per base
│   └── _plugins/<plugin-slug>/       # drop-in plugin files
├── scripts/
│   ├── build-registry.ts             # MDX → public/registry.json
│   ├── check-links.ts                # HEAD every repo / demo URL
│   └── smoke-templates.ts            # scaffold every combo + install + typecheck/build
├── registry.schema.json              # JSON Schema for boilerplate frontmatter
├── plugin.schema.json                # JSON Schema for plugin frontmatter
├── renovate.json                     # Renovate config
└── .github/workflows/                # CI gates
```

## Stack

- **Next.js 16** (App Router, static export — Pagefind needs flat HTML)
- **TypeScript strict** throughout
- **Tailwind CSS v4** + **shadcn/ui** (workspace package `@workspace/ui`)
- **MDX** for entries, `react-markdown` for the rendered body
- **Pagefind** for client-side search, built at deploy time
- **@clack/prompts** for the CLI UX
- **giget** in the CLI to clone repos
- **npm workspaces** + **Turborepo** for the monorepo
- **Vercel** for hosting

## Quickstart

```bash
npm install
npm run dev               # runs the web app (regenerates registry.json first)
```

Visit `http://localhost:3000`. Hit `⌘K` for the search palette.

## The registry

The registry is two collections of MDX files:

- `apps/web/content/boilerplates/<slug>.mdx` — bases
- `apps/web/content/plugins/<slug>.mdx` — add-ons

Frontmatter is YAML, validated against [`registry.schema.json`](./registry.schema.json) (boilerplates) and [`plugin.schema.json`](./plugin.schema.json) (plugins). The MDX body powers the detail page; the frontmatter feeds the CLI picker and the filter UI on the site.

Boilerplates can declare:

- `bundledPlugins` — plugins already wired into the base (informational, shown on the detail page).
- `compatiblePlugins` — plugins the CLI offers to add at scaffold time.

Plugins declare `compatibleStacks`, `requires`, `conflicts`, `env`, and a `source` pointing to a git folder. The CLI resolves the dependency graph and applies plugins in order.

## Scripts

| Script                          | What it does                                                  |
| ------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                   | Run the web app (regenerates `registry.json` first)           |
| `npm run build`                 | Build the web app, run Pagefind, copy index for dev           |
| `npm run typecheck`             | Typecheck every workspace via Turbo                           |
| `npm run registry:build`        | Generate `apps/web/public/registry.json` from MDX             |
| `npm run registry:validate`     | Validate MDX frontmatter against the schemas (no write)       |
| `npm run check:links`           | HEAD every `repo` and `demo` URL in the registry              |
| `npm run smoke`                 | Scaffold every combo, install, typecheck (catches base⨯plugin breakage) |
| `npm run smoke:build`           | Same as `smoke` but runs the full `next build` per combo      |

## Contributing

- **Adding a boilerplate**: see [CONTRIBUTING.md](./CONTRIBUTING.md) → *Adding a boilerplate*.
- **Adding a plugin**: see [CONTRIBUTING.md](./CONTRIBUTING.md) → *Adding a plugin*.
- **Fixing a bug**: open a PR. CI runs `registry:validate`, `typecheck`, and `smoke` on every PR.
- Acceptance rules: [boila.dev/guidelines](https://boila.dev/guidelines).

## CLI package

The CLI lives at [`packages/cli/`](./packages/cli/) and is published as [`boila`](https://www.npmjs.com/package/boila). It depends on `giget`, `@clack/prompts`, and `picocolors` only, stays under 1 MB installed, and resolves everything through `https://boila.dev/registry.json` — no hardcoded repo URLs.

Local dev against in-repo templates:

```bash
npm --workspace boila run build
npm --workspace boila run dev                       # interactive
npm --workspace boila run dev next-shadcn --bare    # non-interactive
```

The dev script wires `BOILA_REGISTRY` and `BOILA_TEMPLATES_DIR` so the CLI hits in-repo files without any network call.

## What this project is NOT

No backend, no database, no auth provider. No web submission form. No runtime fetch of the registry on the web app — it's read at build time. The catalog is files, the PR is the curation gate.

## License

MIT — see [`LICENSE`](./LICENSE).
