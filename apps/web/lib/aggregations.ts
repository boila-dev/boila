/*
 * Derived views over BOILERPLATES used by the /stacks and /use-cases pages.
 * Pure functions over the mock dataset — when the MDX pipeline lands,
 * these signatures stay the same and read from the built registry instead.
 */
import {
  BOILERPLATES,
  STACK_LABELS,
  USE_CASE_LABELS,
  type Boilerplate,
  type UseCase,
} from "./boilerplates"

export type StackAggregate = {
  slug: string
  label: string
  count: number
  examples: Boilerplate[]
}

export function aggregateByStack(): StackAggregate[] {
  const map = new Map<string, Boilerplate[]>()
  for (const b of BOILERPLATES) {
    for (const s of b.stack) {
      const list = map.get(s) ?? []
      list.push(b)
      map.set(s, list)
    }
  }
  return Array.from(map.entries())
    .map(([slug, list]) => ({
      slug,
      label: STACK_LABELS[slug] ?? slug,
      count: list.length,
      examples: list.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export type UseCaseAggregate = {
  slug: UseCase
  label: string
  count: number
  examples: Boilerplate[]
}

export function aggregateByUseCase(): UseCaseAggregate[] {
  const map = new Map<UseCase, Boilerplate[]>()
  for (const b of BOILERPLATES) {
    for (const u of b.useCases) {
      const list = map.get(u) ?? []
      list.push(b)
      map.set(u, list)
    }
  }
  return Array.from(map.entries())
    .map(([slug, list]) => ({
      slug,
      label: USE_CASE_LABELS[slug],
      count: list.length,
      examples: list.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}
