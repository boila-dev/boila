"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch: render a neutral placeholder until mounted.
  React.useEffect(() => setMounted(true), [])

  const current = (mounted ? resolvedTheme : null) ?? "light"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={mounted ? `Theme: ${theme ?? "system"}` : "Theme"}
        >
          <Sun
            className="size-4 scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90"
            aria-hidden
          />
          <Moon
            className="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem
          data-active={theme === "light"}
          onClick={() => setTheme("light")}
          className="gap-2"
        >
          <Sun className="size-4" />
          Light
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">·</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-active={theme === "dark"}
          onClick={() => setTheme("dark")}
          className="gap-2"
        >
          <Moon className="size-4" />
          Dark
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">·</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-active={theme === "system"}
          onClick={() => setTheme("system")}
          className="gap-2"
        >
          <Monitor className="size-4" />
          System
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">
              ({current})
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
