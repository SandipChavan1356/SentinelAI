# Sentinel — Incident Console (Frontend)

Vite + React 19 + TypeScript + Tailwind + React Query, built to pair with your Express/MongoDB Sentinel AI backend.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

By default `VITE_DEV_PROXY_TARGET=http://localhost:8000` in `.env.example` — change this to match your backend's actual `PORT` from its own `.env`. The Vite dev server proxies `/api/*` to this address, so you get **no CORS errors during local dev**, even without touching the backend.

## Two things to fix in your backend

**1. Add CORS (needed once you deploy frontend + backend separately)**

`cors` is already in your `package.json` dependencies but never used. In `src/app.ts`:

```ts
import cors from "cors";
app.use(cors());
```

**2. Add a global error handler**

Your `ApiError` class and `asyncHandler` forward errors via `next(err)`, but no error-handling middleware is registered — so Express's default handler catches them instead, and the client never sees your `{ statusCode, message, success }` shape. Add this at the bottom of `src/app.ts`, after your routes:

```ts
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    data: null,
    message: err.message || "Internal Server Error",
    success: false,
  });
});
```

The frontend already handles both cases gracefully (falls back to a generic message if the response isn't JSON), so nothing breaks either way — this just gives you cleaner error messages in the UI.

## Production build

```bash
npm run build   # outputs to dist/
```

Set `VITE_API_BASE_URL` to your deployed backend's full API URL (e.g. `https://sentinel-api.onrender.com/api/v1`) as a build-time env var on your host (Vercel/Netlify). This bypasses the dev proxy and calls the backend directly — which is when the `cors()` fix above becomes required.

## Pages

| Route | What it does |
|---|---|
| `/` | Overview — stat readouts, recent incidents, live log feed |
| `/services` | Register services, view health |
| `/logs` | Filterable log stream, manual log ingestion |
| `/incidents` | List, sorted by severity |
| `/incidents/:id` | Detail — status control, **Run AI Analysis** (summary/root cause/fix/confidence gauge) |
| `/knowledge` | Playbook entries |
| `/recall` | Semantic vector search over logs + knowledge |

No auth UI — your backend's auth middleware is currently empty, so none was needed. Add it back in if/when you implement real auth.
