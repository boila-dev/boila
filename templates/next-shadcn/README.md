# next-shadcn

Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui starter.

Scaffolded with [boila](https://boila.dev):

```bash
npx boila next-shadcn
```

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## What's wired

- **Next.js 15** App Router, React 19, TypeScript strict
- **Tailwind CSS v4** with `@theme` tokens (no `tailwind.config.js`)
- **shadcn/ui** in `new-york` style — `button`, `input`, `label`, `dialog`, `sonner`
- **next-themes** for dark mode with a `ThemeToggle` in the header
- **Geist** sans + mono fonts via `next/font/google`
- ESLint flat config preset (`next/core-web-vitals`, `next/typescript`)

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add card form sheet
```

The CLI reads `components.json` and writes new primitives into `components/ui/`.

## Structure

```
app/
  layout.tsx        # Root layout, fonts, theme provider, toaster
  page.tsx          # Demo home page
  globals.css       # Tailwind + theme tokens
components/
  ui/               # shadcn primitives
  theme-provider.tsx
  theme-toggle.tsx
lib/
  utils.ts          # cn() helper
```
