import type { Metadata } from "next"
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boila.dev"

// Body / UI text — stand-in for `Unica77 Cohere Web` (proprietary).
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Display / headlines — stand-in for `CohereText` (proprietary). Tight,
// near-monospaced cadence consistent with Cohere's hero typography.
const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
})

// Technical labels — stand-in for `CohereMono` (proprietary).
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Boila — pick a starter, ship today",
    template: "%s · Boila",
  },
  description:
    "A community-curated registry of frontend and full-stack boilerplates. Scaffold any starter with one command: npx @boila/cli <slug>.",
  applicationName: "Boila",
  keywords: [
    "boilerplate",
    "starter",
    "scaffold",
    "next.js",
    "remix",
    "astro",
    "vite",
    "saas",
    "monorepo",
  ],
  authors: [{ name: "Boila contributors", url: SITE_URL }],
  creator: "Boila contributors",
  openGraph: {
    type: "website",
    siteName: "Boila",
    title: "Boila — pick a starter, ship today",
    description:
      "Curated frontend / full-stack boilerplates, scaffoldable with one CLI command.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boila — pick a starter, ship today",
    description:
      "Curated frontend / full-stack boilerplates, scaffoldable with one CLI command.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        fontSans.variable,
        fontDisplay.variable,
        fontMono.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
