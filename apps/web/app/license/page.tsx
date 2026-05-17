import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "License",
  description:
    "Boila is MIT-licensed. Each boilerplate carries its own license.",
}

const LICENSE_TEXT = `MIT License

Copyright (c) 2026 Boila contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

export default function LicensePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 pt-16 pb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              License
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.03em] md:text-6xl">
              MIT.
              <br />
              Use it, fork it, ship it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              The Boila registry, the website, and the CLI are all MIT.
              Individual boilerplates each carry their own license — listed on
              their detail page and validated against a permissive allowlist
              before they land in the catalog.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="flex items-center gap-3">
              <Badge>Boila</Badge>
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                MIT
              </span>
            </div>
            <pre className="mt-8 overflow-x-auto rounded-2xl border border-border bg-muted/60 p-6 font-mono text-xs leading-relaxed">
              <code>{LICENSE_TEXT}</code>
            </pre>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-16">
            <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">
              Boilerplate licenses
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              We only accept entries with a permissive license: MIT,
              Apache-2.0, ISC, BSD-2-Clause, BSD-3-Clause. The enum lives in{" "}
              <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                registry.schema.json
              </code>{" "}
              and is enforced by{" "}
              <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                npm run registry:validate
              </code>
              .
            </p>
            <div>
              <Link
                href="/guidelines"
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
              >
                Read the curation guidelines →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
