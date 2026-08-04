# GLM Usage Monitor

Dashboard for monitoring GLM model call and token usage, with hourly (Today / 7 Days) and daily (30 Days) views.

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

2. Create `.env` in the project root (gitignored):

   ```env
   ZAI_API_KEY=<your Z.AI API key>
   ```

3. Start the dev server:

   ```bash
   bun run dev
   ```

The dev server proxies `/api/*` requests to `https://api.z.ai/api/*` and injects the
`Authorization: Bearer` header server-side, so the API key never reaches the browser.

## Deploying to Cloudflare Pages

The dashboard is a static SPA plus one Pages Function (`functions/api/[...path].ts`)
that proxies API requests so the API key stays server-side.

### 1. Prerequisites

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed and logged in:

  ```bash
  bunx wrangler login
  ```

- A Cloudflare account.

### 2. Build

```bash
bun run build
```

Outputs:
- `dist/` — the static site
- `functions/` — the proxy function (deployed alongside automatically)

### 3. Deploy

```bash
bunx wrangler pages deploy dist --project-name glm-monitor
```

### 4. Set the API key

The API key is **not** in the bundle — it must be set on the Pages project:

1. Cloudflare dashboard → your Pages project → **Settings** → **Environment variables**
2. Add `ZAI_API_KEY` with your Z.AI API key (Production environment)
3. The change takes effect on the next deployment (re-run step 3 to apply)

### 5. Verify

Open your deployed URL — the dashboard should load with live data. Check the
network tab (or `curl https://<project>.pages.dev/api/monitor/usage/model-usage?startTime=...`)
to confirm the proxy works.

## How the API key flows

```
Browser ──GET /api/...──▶ Cloudflare Pages Function ──▶ https://api.z.ai/api/...
                          (adds Authorization: Bearer)         │
Browser ◀─────────────── JSON ◀───────────────────────────────┘
```

- **Dev:** Vite proxy in `vite.config.ts` (reads `.env`)
- **Prod:** Pages Function `functions/api/[...path].ts` (reads `ZAI_API_KEY` env var)

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `bun run dev`        | Start dev server with proxy          |
| `bun run build`      | Type-check + build to `dist/`        |
| `bun run preview`    | Preview the production build locally |
| `bun run lint`       | Run oxlint                           |
