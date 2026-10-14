# TDC Matchmaker

An internal dashboard for The Date Crew's matchmakers. Sign in, see your
customers, open one to read their full biodata, and get ranked matches with
a short note on why each one could work. Send a match with an editable
email.

- Live demo: _added after deploy_
- How the matching and AI work: [REPORT.md](REPORT.md)

## Sign in

| Username | Password |
|---|---|
| priya | priya123 |
| arjun | arjun123 |

Each matchmaker sees only their own 12 customers.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Variable | Needed | What it does |
|---|---|---|
| `AUTH_SECRET` | In production | Signs the session cookie. Any long random string. |
| `GROQ_API_KEY` | No | Turns on the AI review. Free at console.groq.com. Without it, matches use the rule-based score and note. |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-20b`. Change it if Groq retires that model. |

## Scripts

| Script | What it does |
|---|---|
| `npm run seed` | Regenerates the 300 profiles and 24 customers from a fixed seed |
| `npm test` | Unit tests for the matching engine |
| `npm run complexity` | Cyclomatic complexity per function, worst first |
| `npm run check` | Typecheck, lint (fails over complexity 10), tests, prose check, unused code check |

## Stack

Next.js 16 with route handlers as the API, TypeScript, Tailwind 4, shadcn/ui
on Radix, zod, jose and bcryptjs for auth, Groq through the OpenAI SDK.
Data is static JSON loaded into memory. See REPORT.md for why.

## Layout

```
src/app/                 pages and API route handlers
src/server/matching/     the algorithm, pure functions
src/server/ai/           the Groq review and its fallback
src/server/services/     auth, customers, matches
src/server/data/         seed JSON and the in-memory store
src/components/          screens built from shadcn primitives
src/types/               types shared by client and server
scripts/                 seed generator and complexity report
tests/                   matching tests
```
