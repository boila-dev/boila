import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@workspace/ui/lib/utils"

/*
 * Renders the markdown body of a boilerplate entry with a Cohere-tuned
 * editorial scale (display headings, restrained body, mono-feel code).
 *
 * react-markdown renders to React elements directly — no raw HTML
 * injection — and remark-gfm gives us tables, strikethrough, task lists.
 */
export function MarkdownBody({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 font-display text-3xl leading-tight tracking-[-0.02em]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 font-display text-2xl leading-tight tracking-[-0.01em]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 font-display text-xl leading-tight tracking-[-0.01em]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed text-foreground/85">
              {children}
            </p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-brand-action-blue underline underline-offset-4 decoration-brand-action-blue/40 hover:decoration-brand-action-blue"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="ml-1 flex flex-col gap-2 text-base text-foreground/85 marker:text-muted-foreground [&_li]:pl-2 [&>li]:list-disc [&>li]:list-inside">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-1 flex flex-col gap-2 text-base text-foreground/85 marker:text-muted-foreground [&_li]:pl-2 [&>li]:list-decimal [&>li]:list-inside">
              {children}
            </ol>
          ),
          code: ({ children, className: cls }) => {
            const inline = !cls
            return inline ? (
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            ) : (
              <code className={cls}>{children}</code>
            )
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/60 p-5 font-mono text-xs leading-relaxed">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-coral pl-4 text-foreground/75 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
