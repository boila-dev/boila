/*
 * Server helper: pull the authoritative session from request headers and
 * redirect to /sign-in if the user isn't signed in.
 *
 * Usage in a server component:
 *
 *   const { user } = await requireUser()
 */
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) redirect("/sign-in")
  return session
}
