# Security policy

## Reporting a vulnerability

**Do not open a public GitHub issue for security reports.**

Use GitHub's [private vulnerability reporting](https://github.com/boila-dev/boila/security/advisories/new) instead. The advisory stays private until we ship a fix.

Include:

- The component affected (web app, CLI, a specific boilerplate template, a specific plugin).
- A reproduction (commands, payload, or PoC).
- The version or commit you're on.
- The impact you observed and your assessment of severity.

We aim to acknowledge within **72 hours** and ship a fix or mitigation within **14 days** for high-severity issues, longer for lower severity.

## Scope

In scope:

- `apps/web` — the boila.dev site.
- `packages/cli` — the `boila` npm package.
- `scripts/` — the registry build and link-check tooling.
- `templates/` — code we ship as scaffold sources, when the vulnerability is in code we wrote (not in upstream deps).

Out of scope:

- Vulnerabilities in upstream dependencies — report those upstream. We'll bump the dep once it's patched (Renovate handles most of this).
- Vulnerabilities in third-party boilerplates the catalog *links to* — report those to the upstream repo.
- Findings on `boila.dev` that require physical access, social engineering, or denial-of-service through volume.

## Supported versions

| Component | Supported |
| --------- | --------- |
| `boila` CLI — latest minor | ✅ |
| `boila` CLI — older versions | best effort |
| `apps/web` — production deploy | ✅ |
| Templates — latest in `main` | ✅ |
| Templates — older scaffolded copies | ❌ (you own your scaffold once cloned) |

## Disclosure

We coordinate disclosure with the reporter. Default: we publish the advisory once a fix is shipped and the patched version is available on npm + deployed.

Credit is given in the advisory unless you ask otherwise.
