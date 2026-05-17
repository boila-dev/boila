import { ImageResponse } from "next/og"

/*
 * Global OpenGraph card for the home page and any route that doesn't
 * provide its own opengraph-image.tsx. Rendered at build time by
 * next/og (Satori), so only inline styles + flex layout work — no
 * Tailwind classes here.
 *
 * Style mirrors the Cohere `dark-feature-band` treatment: deep-green
 * canvas, oversized display headline, coral mono label, white sub-copy.
 */
// `output: "export"` requires the route to opt into static rendering.
export const dynamic = "force-static"
export const runtime = "nodejs"
export const alt = "Boila — pick a starter, ship today"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#003c33",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#17171c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            b
          </div>
          <span style={{ fontSize: "32px", letterSpacing: "-0.02em" }}>
            boila
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ff7759",
            }}
          >
            The boilerplate registry
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "108px",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontWeight: 500,
              maxWidth: "1000px",
            }}
          >
            <span>Pick a starter.</span>
            <span>Ship today.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "24px",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span style={{ fontFamily: "monospace" }}>npx @boila/cli &lt;slug&gt;</span>
          <span>boila.dev</span>
        </div>
      </div>
    ),
    size
  )
}
