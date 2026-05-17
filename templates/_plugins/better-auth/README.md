# better-auth (plugin)

Drops a working email + password auth flow on top of any compatible boilerplate. Uses [Better Auth](https://better-auth.com) with the Drizzle SQLite adapter — zero database setup for local dev.

## Files added

```
app/
  api/auth/[...all]/route.ts   # Better Auth handler
  sign-in/page.tsx
  sign-up/page.tsx
  dashboard/page.tsx           # protected demo page
components/
  sign-out-button.tsx
lib/
  auth.ts                      # server config (Drizzle adapter)
  auth-client.ts               # React client
  require-user.ts              # server helper for protected routes
  db/index.ts                  # better-sqlite3 + Drizzle client
  db/schema.ts                 # user / session / account / verification
middleware.ts                  # protects /dashboard via cookie check
drizzle.config.ts
```

## Installing (after scaffold)

The CLI prints these as next steps — pasted here for reference:

```bash
pnpm add better-auth better-sqlite3 drizzle-orm dotenv
pnpm add -D drizzle-kit @types/better-sqlite3
pnpm drizzle-kit push
```

Then add these to `.env.local`:

```
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_FILE=sqlite.db
```

Generate the secret with `openssl rand -base64 32`.

## Trying it

```bash
pnpm dev
```

- `/sign-up` to create an account
- `/sign-in` for returning users
- `/dashboard` is the protected page (middleware + server check)

## Switching to Postgres

1. Swap `better-sqlite3` for `pg` (or `postgres`), update `lib/db/index.ts` to use `drizzle-orm/node-postgres` (or `drizzle-orm/postgres-js`).
2. Change `provider: "sqlite"` → `"pg"` in `lib/auth.ts`.
3. Change `dialect: "sqlite"` → `"postgresql"` in `drizzle.config.ts`.
4. Re-run `pnpm drizzle-kit push`.

## Adding social providers

Edit `lib/auth.ts`:

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
```

Then add `signIn.social({ provider: "github" })` to your sign-in page.
