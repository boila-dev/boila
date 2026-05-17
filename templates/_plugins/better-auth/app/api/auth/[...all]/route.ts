import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

// Auth flows are never static — opting this route out of build-time data
// collection avoids opening the DB during `next build`.
export const dynamic = "force-dynamic"

export const { GET, POST } = toNextJsHandler(auth)
