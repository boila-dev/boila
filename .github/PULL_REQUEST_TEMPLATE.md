<!--
Thanks for opening a PR! Fill in the relevant sections and delete the rest.
-->

## What & why

<!-- One paragraph: what does this PR change, and why? Link the issue if any. -->

Closes #

## Type of change

<!-- Tick exactly one -->

- [ ] **Boilerplate** — new entry under `templates/<slug>/` + MDX in `apps/web/content/boilerplates/`
- [ ] **Plugin** — new entry under `templates/_plugins/<slug>/` + MDX in `apps/web/content/plugins/`
- [ ] **Platform** — web app, CLI, scripts, or infra
- [ ] **Dependency** — Renovate or manual bump
- [ ] **Docs** — README, CONTRIBUTING, etc.

## Pre-merge checklist

- [ ] `npm run registry:validate` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run smoke` passes (or `npm run smoke -- --only <slug>` for a targeted change)
- [ ] For boilerplate/plugin entries: I read [the curation guidelines](https://boila.dev/guidelines) and my entry meets the acceptance bar
- [ ] For plugin entries: no file collisions with the boilerplates listed under `compatibleStacks`
- [ ] For breaking changes: the commit body includes `BREAKING CHANGE:` so release-please picks it up

## Screenshots / output

<!-- For UI changes, attach a screenshot or recording. For CLI changes, paste the new output. -->
