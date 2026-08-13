# GLM Usage Monitor

Dashboard for monitoring GLM model call and token usage, with hourly
(Today / 7 Days) and daily (30 Days) views.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- Quota dashboard: remaining tokens, usage %, burn-rate, and estimated
  run-out countdown before reset
- Usage views: **Today** (hourly), **7 Days** (hourly), **30 Days** (daily)
- Usage pattern analysis: tokens/calls by hour-of-day and weekday
- Metric flip (calls ⇄ tokens), daily ⇄ hourly granularity, hide-zero-row toggle
- Auto-refresh with edge-cached proxy; dark/light mode

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Recharts
- Cloudflare Pages (with a Pages Function proxy)
- Bun

## Local Development

1. Install dependencies:

   ```bash
   bun install
   ```

2. Get the `.env.keys` file from the repo owner and place it at the project
   root. `.env` is committed **encrypted** (via
   [dotenvx](https://dotenvx.com)); `.env.keys` holds the private key needed
   to decrypt it and is **gitignored** — never commit it.

3. Start the dev server:

   ```bash
   bun run dev
   ```

   `vite.config.ts` imports `@dotenvx/dotenvx/config`, which decrypts `.env`
   into `process.env` automatically, so the dev proxy can inject the
   `Authorization: Bearer` header server-side. The API key never reaches the
   browser.

To add or change a value, use dotenvx (it re-encrypts automatically), then
commit the updated `.env`:

```bash
bunx dotenvx set NEW_KEY "some-value"
```

## Deploying to Cloudflare Pages

The dashboard is a static SPA plus one Pages Function (`functions/api/[[path]].ts`)
that proxies API requests so the API key stays server-side. Deploy via native
Git integration — every push to `main` rebuilds and deploys automatically.

### 1. Connect the repo

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**
2. Authorize the Cloudflare GitHub app and select this repo
3. Project name: `glm-monitor` (becomes the `*.pages.dev` subdomain);
   production branch: `main`

### 2. Build settings

| Field | Value |
| --- | --- |
| Framework preset | React (Vite) |
| Build command | `bun run build` |
| Build output directory | `dist` |
| Root directory | (leave empty) |

Cloudflare detects Bun from `bun.lock`. To gate deploys on lint, set the
build command to `bun run lint && bun run build` instead.

### 3. Set the API key

The API key is **not** in the bundle — the Pages Function reads it from a
runtime environment variable. Under **Environment variables**, add:

- `ZAI_API_KEY` — your Z.AI API key (Production environment)

Get the value locally with `bunx dotenvx get ZAI_API_KEY`.

### 4. Save and Deploy

Cloudflare builds and deploys. Subsequent pushes to `main` redeploy
automatically — no CLI or workflow file required.

> The build log prints a `could not decrypt .env` warning — this is expected
> and harmless. `.env.keys` (the decryption key) is gitignored, so it isn't
> in the build environment; the key isn't needed at build time anyway.

### 5. Verify

Open the deployed URL — the dashboard should load with live data. Check the
network tab (or
`curl https://glm-monitor.pages.dev/api/monitor/usage/model-usage?startTime=...`)
to confirm the proxy works. A `401` means `ZAI_API_KEY` is missing or wrong.

## How the API key flows

```text
Browser ──GET /api/...──▶ Cloudflare Pages Function ──▶ https://api.z.ai/api/...
                          (adds Authorization: Bearer)         │
Browser ◀─────────────── JSON ◀───────────────────────────────┘
```

- **Dev:** Vite proxy in `vite.config.ts` (reads `.env`)
- **Prod:** Pages Function `functions/api/[[path]].ts` (reads `ZAI_API_KEY` env var)

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `bun run dev`        | Start dev server with proxy          |
| `bun run build`      | Type-check + build to `dist/`        |
| `bun run preview`    | Preview the production build locally |
| `bun run lint`       | Run Biome (format + lint + imports)  |
| `bun run lint:fix`   | Biome check with auto-fixes (write)  |
| `bun run format`     | Format all files with Biome (write)  |
