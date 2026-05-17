/*
 * Protected demo page. Uses the server `requireUser()` helper to redirect
 * unauthenticated visitors. The middleware does a cheap cookie check first
 * (see middleware.ts) — this is the authoritative database read.
 */
import { SignOutButton } from "@/components/sign-out-button"
import { requireUser } from "@/lib/require-user"

export default async function DashboardPage() {
  const { user } = await requireUser()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        Dashboard
      </span>
      <h1 className="text-4xl font-semibold tracking-tight">
        Hello, {user.name}.
      </h1>
      <p className="text-muted-foreground">
        Signed in as{" "}
        <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
          {user.email}
        </code>
        . This route is gated by middleware and re-verified server-side.
      </p>
      <div>
        <SignOutButton />
      </div>
    </div>
  )
}
