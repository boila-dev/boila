"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

type Props = {
  slug?: string
  command?: string
  className?: string
  tone?: "light" | "dark"
}

export function InstallCommand({
  slug,
  command,
  className,
  tone = "light",
}: Props) {
  const cmd = command ?? `npx boila ${slug ?? "<slug>"}`
  const [copied, setCopied] = React.useState(false)

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore — clipboard API not available
    }
  }, [cmd])

  const isDark = tone === "dark"

  return (
    <div
      data-tone={tone}
      className={cn(
        "flex items-center gap-3 rounded-md border px-4 py-3 font-mono text-sm",
        isDark
          ? "border-white/10 bg-white/4 text-white"
          : "border-border bg-muted text-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "select-none",
          isDark ? "text-white/40" : "text-muted-foreground"
        )}
      >
        $
      </span>
      <code className="flex-1 truncate">{cmd}</code>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy install command"}
        className={cn(
          isDark && "text-white/70 hover:bg-white/10 hover:text-white"
        )}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
