/*
 * Resolves the canonical site URL with two safety nets:
 *
 * 1. Falls back to https://boila.dev when no env override is set (local
 *    dev, preview deploys without a custom env var).
 * 2. Prepends "https://" if the env value is missing the scheme. Vercel
 *    exposes raw hostnames (e.g. `boila-web.vercel.app`) and operators
 *    sometimes paste a custom domain without the protocol — both would
 *    blow up `new URL(...)` in metadata config.
 */
const DEFAULT = "https://boila.dev"

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT)

function normalize(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return DEFAULT
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "")
  return `https://${trimmed.replace(/\/+$/, "")}`
}
