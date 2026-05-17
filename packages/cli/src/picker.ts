/*
 * Thin wrappers around @clack/prompts that translate our domain types
 * (Boilerplate, Plugin) into the option shape clack expects.
 *
 * Both pickers throw on cancel — the caller catches via `isCancel` from
 * @clack/prompts or just lets it bubble to a top-level cancel handler.
 */
import { isCancel, multiselect, select } from "@clack/prompts"
import color from "picocolors"

import type { Boilerplate, Plugin } from "./types.js"

export const CANCEL = Symbol("cancel")

export async function pickBoilerplate(
  boilerplates: Boilerplate[]
): Promise<Boilerplate | typeof CANCEL> {
  const slug = await select({
    message: "Pick a boilerplate",
    options: boilerplates.map((b) => ({
      value: b.slug,
      label: b.name,
      hint: b.description,
    })),
  })
  if (isCancel(slug)) return CANCEL
  return boilerplates.find((b) => b.slug === slug)!
}

export async function pickPlugins(
  plugins: Plugin[]
): Promise<string[] | typeof CANCEL> {
  if (plugins.length === 0) return []
  const selected = await multiselect({
    message: "Plugins to add",
    options: plugins.map((p) => ({
      value: p.slug,
      label: p.name,
      hint: `${color.dim(`[${p.category}]`)} ${p.description}`,
    })),
    required: false,
  })
  if (isCancel(selected)) return CANCEL
  return selected as string[]
}
