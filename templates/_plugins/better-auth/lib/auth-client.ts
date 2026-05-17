/*
 * Browser-side Better Auth client. Re-export only the hooks/methods you
 * actually use to keep the bundle small.
 */
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
