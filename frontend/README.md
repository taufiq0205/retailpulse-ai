# RetailPulse AI — Frontend

Demand forecasting and inventory decision web app for Malaysian SME retailers.
Consumes the RetailPulse FastAPI backend; auth via Supabase.

## Stack
- React 19 + Vite + TypeScript (strict)
- React Router 7
- Tailwind CSS 4
- TanStack Query
- Recharts
- React Hook Form + Zod
- Supabase Auth
- Vitest (unit) / Playwright (E2E, planned)

## Environment
Copy `.env.example` to `.env` and fill in:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
If env vars are missing, the app falls back to an in-memory mock DB so the UI is explorable without a backend.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run test     # vitest
```

## Pages
`/login`, `/register`, `/` (dashboard), `/products`, `/inventory`,
`/sales/upload`, `/forecasts`, `/recommendations`, `/alerts`,
`/model-performance`, `/settings`.

Routes except `/login` and `/register` are wrapped in `ProtectedShell`
and require a Supabase session.