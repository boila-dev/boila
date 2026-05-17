/*
 * Mirror of registry.schema.json + plugin.schema.json (subset). The CLI
 * only consumes a few fields — keep this lean to keep the install footprint
 * small.
 */
export type Boilerplate = {
  slug: string
  name: string
  description: string
  repo: string
  branch?: string
  subdir?: string
  stack: string[]
  useCases: string[]
  features?: string[]
  bundledPlugins?: string[]
  compatiblePlugins?: string[]
  authors: string[]
  maintained: boolean
  license: string
  demo?: string
  addedAt: string
  installCommand?: string
  envSetup?: string[]
}

export type Plugin = {
  slug: string
  name: string
  description: string
  category: string
  compatibleStacks?: string[]
  requires?: string[]
  conflicts?: string[]
  env?: string[]
  source: {
    repo: string
    branch?: string
    subdir: string
  }
  postInstall?: string
  authors: string[]
  maintained: boolean
  license: string
  docs?: string
  addedAt: string
}

export type Registry = {
  $schema?: string
  version: number
  generatedAt: string
  counts?: { boilerplates: number; plugins: number }
  /** Legacy field from registry v1 — still tolerated for older builds. */
  count?: number
  boilerplates: Boilerplate[]
  plugins?: Plugin[]
}
