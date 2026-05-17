# boila

Scaffold curated frontend / full-stack boilerplates with one command.

```bash
npx @boila/cli                  # interactive picker
npx @boila/cli <slug>           # scaffold into ./<slug>
npx @boila/cli <slug> <dir>     # scaffold into <dir>
npx @boila/cli search <term>    # list matching entries
```

Browse the catalog at [boila.dev](https://boila.dev).

## How it works

1. Fetches `https://boila.dev/registry.json` (generated at build time
   from MDX files in the [Boila monorepo](https://github.com/boila-dev/boila)).
2. Resolves the slug to a repo URL + branch + subdir.
3. Calls [`giget`](https://github.com/unjs/giget) to clone into the
   target directory.
4. Prints post-scaffold instructions (install command, env vars).

No hardcoded URLs, no telemetry, no analytics.

## Examples

```bash
# Pick interactively
npx @boila/cli

# Direct scaffold
npx @boila/cli t3-saas-starter
npx @boila/cli next-landing-bento my-launch

# Search the registry from the terminal
npx @boila/cli search edge
npx @boila/cli search "saas dashboard"
```

## Configuration

| Env var          | Default                              | Purpose                                                          |
| ---------------- | ------------------------------------ | ---------------------------------------------------------------- |
| `BOILA_REGISTRY` | `https://boila.dev/registry.json`    | URL or local file path. Used in dev against an in-repo registry. |
| `NO_COLOR`       | unset                                | Disables ANSI output. Auto-skipped on non-TTY stdout.            |

## Exit codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| `0`  | Success.                                       |
| `1`  | User cancelled, or target directory exists.    |
| `2`  | Slug not found in the registry.                |
| `3`  | Registry fetch failed or scaffold failed.      |

## Contributing

`@boila/cli` is part of the [Boila monorepo](https://github.com/boila-dev/boila).
To add a boilerplate to the registry, see the
[contribution guide](https://boila.dev/contribute).

## License

MIT
