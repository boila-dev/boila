# Contributing to Boila

Three ways to contribute, in order of likely impact:

1. **Submit a boilerplate** — a curated starter for a stack/use-case combo that isn't covered yet.
2. **Submit a plugin** — a drop-in add-on (auth, payments, email, analytics…) applicable to one or more boilerplates.
3. **Fix bugs / improve the platform** — the web app (`apps/web`), the CLI (`packages/cli`), the registry pipeline (`scripts/`).

## Before you start

- Read [CLAUDE.md](./CLAUDE.md) — it captures the project's north star, what we say no to, and why.
- Read [Curation guidelines](https://boila.dev/guidelines) — the rules a maintainer applies to your PR.
- Skim the existing catalog at [boila.dev](https://boila.dev). The bar for a new entry is **intent differentiation**, not just a different stack.

## Local setup

```bash
git clone https://github.com/boila-dev/boila
cd boila
npm install
npm run dev               # runs the web app, regenerates registry.json first
```

For the CLI:

```bash
npm --workspace boila run build
npm --workspace boila run dev next-shadcn      # tests against local templates/
```

The dev script wires `BOILA_REGISTRY` + `BOILA_TEMPLATES_DIR` so the CLI hits in-repo templates without any network call.

## Adding a boilerplate

A boilerplate has **two pieces**:

1. The actual project source under `templates/<your-slug>/`. Must install + build from a clean clone.
2. The MDX entry at `apps/web/content/boilerplates/<your-slug>.mdx` with frontmatter validated against [`registry.schema.json`](./registry.schema.json).

Then:

```bash
npm run registry:validate                 # frontmatter + cross-refs
npm run smoke -- --only <your-slug>       # scaffold + install + typecheck
```

Open a PR. CI runs both checks. A maintainer reviews curation fit (intent, maintenance posture, license, README quality).

### Acceptance bar

- Repo is public and maintained (commit within ~6 months — applies to upstream you reference).
- Install + run works from a clean clone, no manual surgery.
- Intent is distinct from existing entries — different stack alone isn't enough.
- License is permissive: MIT, Apache-2.0, ISC, BSD-2/3.
- `description` is one line ≤ 120 chars, not marketing-y.

## Adding a plugin

Same pattern, two pieces:

1. The drop-in files under `templates/_plugins/<your-slug>/`. **No file collisions** with any boilerplate that lists it as `compatiblePlugins`.
2. The MDX entry at `apps/web/content/plugins/<your-slug>.mdx` with frontmatter validated against [`plugin.schema.json`](./plugin.schema.json).

Plugins must be **drop-in** — no codemods, no AST patching. If you can't express the integration as files-to-add, talk to us first via a [GitHub Discussion](https://github.com/boila-dev/boila/discussions).

Declare:

- `compatibleStacks` — which base stacks the plugin targets.
- `requires` — other plugin slugs that must be present (auto-pulled by the CLI).
- `env` — every environment variable the plugin needs.
- `postInstall` — exactly the commands a fresh scaffold needs to run after `npm install`.

Then:

```bash
npm run registry:validate
npm run smoke                              # tests every base × plugin combo
```

## Improving the platform

Bug fixes, refactors, perf wins, doc improvements — open a PR directly.

- TypeScript strict, no `any` unless justified inline.
- Tailwind classes ordered by `prettier-plugin-tailwindcss`.
- Server Components by default in `apps/web`; mark `"use client"` only when truly needed.
- Don't add new UI libs — shadcn primitives only.
- The CLI must stay under 1 MB installed. Prefer Node built-ins.

## Conventional commits

We use [Conventional Commits](https://www.conventionalcommits.org/) so [release-please](https://github.com/googleapis/release-please) can auto-generate the CLI changelog.

Examples:

- `feat(cli): support --bare flag`
- `fix(registry): correct slug regex`
- `docs: update plugin guidelines`
- `chore(deps): bump next to 15.5`

Breaking changes go in the body: `BREAKING CHANGE: <description>`.

## Reporting bugs

Use the [bug issue template](https://github.com/boila-dev/boila/issues/new/choose). Include:

- What you ran (full command).
- What you expected vs what happened.
- Node version (`node --version`).
- OS.

Security issues: see [SECURITY.md](./SECURITY.md) — please don't open a public issue for those.

## Reviewing PRs

If you're a maintainer or a regular contributor and want to help triage:

- **Catalog PRs**: apply the acceptance bar above. Maintenance is the moat — be strict.
- **Code PRs**: focus on whether the change pulls its weight. Boila stays small on purpose.
- **Dep bumps from Renovate**: green CI = merge. Majors get human review of the upstream changelog.

## Code of Conduct

Be kind. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
