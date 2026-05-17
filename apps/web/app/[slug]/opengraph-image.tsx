import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"

import {
  BOILERPLATES,
  STACK_LABELS,
  USE_CASE_LABELS,
  getBoilerplate,
} from "@/lib/boilerplates"

/*
 * Per-boilerplate OpenGraph card. One PNG generated at build time per
 * registry slug (matching the `generateStaticParams` of [slug]/page.tsx).
 *
 * Layout — Cohere editorial canvas: white background, coral category
 * chip, oversized display name, supporting one-liner, stack pills on
 * the bottom. Only inline styles work inside next/og (Satori).
 */
// `output: "export"` requires the route to opt into static rendering.
export const dynamic = "force-static"
export const runtime = "nodejs"
export const alt = "Boilerplate detail card"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return BOILERPLATES.map((b) => ({ slug: b.slug }))
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const b = getBoilerplate(slug)
  if (!b) notFound()

  const primaryUseCase = b.useCases[0]
  const stack = b.stack.slice(0, 5)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#212121",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "#17171c",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              b
            </div>
            <span style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>
              boila
            </span>
          </div>
          {primaryUseCase && (
            <span
              style={{
                fontSize: "22px",
                padding: "8px 18px",
                borderRadius: "8px",
                background: "#ff7759",
                color: "#212121",
                fontWeight: 500,
              }}
            >
              {USE_CASE_LABELS[primaryUseCase]}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#93939f",
            }}
          >
            Boilerplate
          </span>
          <span
            style={{
              fontSize: "92px",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              maxWidth: "1056px",
            }}
          >
            {b.name}
          </span>
          <span
            style={{
              fontSize: "28px",
              lineHeight: 1.35,
              color: "#616161",
              maxWidth: "1000px",
            }}
          >
            {b.description}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {stack.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "20px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9dd",
                  color: "#212121",
                }}
              >
                {STACK_LABELS[s] ?? s}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "22px",
              color: "#616161",
            }}
          >
            npx boila {b.slug}
          </span>
        </div>
      </div>
    ),
    size
  )
}
