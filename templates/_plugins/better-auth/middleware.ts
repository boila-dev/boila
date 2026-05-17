/*
 * Edge-safe middleware: presence check on the Better Auth session cookie.
 * Authoritative session validation happens in the protected page via
 * `requireUser()` (lib/require-user.ts).
 *
 * We read the cookie directly instead of importing `better-auth/cookies` to
 * keep the edge bundle small (that helper pulls in `jose`, which warns on
 * the Edge Runtime).
 *
 * If you customise the cookie prefix in `lib/auth.ts`, update the name
 * below to match.
 */
import { type NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "better-auth.session_token"

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
