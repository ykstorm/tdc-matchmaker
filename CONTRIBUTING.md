

# TDC Matchmaker

Internal tool for matchmakers. Next.js App Router, route handlers are the API.

## Where things live

- `src/app/` pages and route handlers. Handlers parse input, call one service, return.
- `src/server/services/` business logic. Only place that touches the store.
- `src/server/matching/` the algorithm. Pure functions, no I/O, fully unit tested.
- `src/server/ai/` OpenAI calls. Every call has a non-AI fallback.
- `src/server/data/` seed JSON and the in-memory store.
- `src/types/` shapes shared by client and server. Never redeclare one elsewhere.
- `src/components/ui/` shadcn primitives. Feature components compose these.
- `scripts/` generators and quality checks.

## Rules

- Functions stay under 30 lines and complexity under 10 (`npm run complexity`).
- Files stay under 200 lines.
- Comments say why. If a comment restates the code, delete it.
- No em dashes, emoji or filler words anywhere (`npm run prose`).
- No unused files, exports or deps (`npm run knip`).
- Use shadcn variants instead of restyling components with className overrides.
- Commits: one subject, imperative first line, a short paragraph on why. No trailers.

## Before every commit

`npm run check` runs typecheck, lint, tests, complexity, prose and knip.
