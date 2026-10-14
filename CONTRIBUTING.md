

# TDC Matchmaker

Internal tool for matchmakers. Next.js App Router. Route handlers are the API.

## Where things live

- `src/app/` pages and route handlers. A handler parses input, calls one service, returns.
- `src/server/services/` business logic. The only code that touches the store.
- `src/server/matching/` the algorithm. Pure functions, no I/O, unit tested.
- `src/server/ai/` the Groq call. It always has a rule-based fallback.
- `src/server/data/` seed JSON and the in-memory store.
- `src/types/` shapes shared by client and server. Never redeclare one.
- `src/components/ui/` shadcn primitives. Feature components compose them.
- `scripts/` the seed generator and quality checks.

## Before writing code (Karpathy, Ponytail)

- Read the code the change touches and trace the real flow first.
- State assumptions. If two readings exist, ask. Don't pick silently.
- Climb the ladder and stop at the first rung that holds:
  1. Does this need to exist? 2. Is it already in this codebase? 3. Does the
  standard library do it? 4. Does the platform do it (HTML, CSS, a DB
  constraint)? 5. Does an installed dependency do it? 6. Can it be one line?
  7. Only then, the minimum code that works.
- No features beyond the assignment. No single-use abstractions. No config for
  values that never change. No scaffolding for later.
- Never cut validation at trust boundaries, error handling that prevents data
  loss, security, or accessibility to make code shorter.
- A deliberate shortcut gets a `shortcut:` comment naming the limit and the upgrade path.
- Logic with branches, loops, money or security gets a test.

## While changing code

- Touch only what the task needs. Match the existing style.
- Remove what your change orphaned. Mention other dead code, don't delete it.
- Fix bugs at the root, once, where every caller passes through.
- Done means verified: `npm run check` passes and the behaviour was exercised.

## Complexity (cyclomatic-complexity skill)

- CC = decision points + 1. Decision points: if, else if, case, loops, catch,
  ternary, `&&`, `||`, `??`.
- 1 to 5 fine. 6 to 10 watch, refactor if touching it anyway. Over 10 fails
  the build (ESLint `complexity` rule). Over 15 is never acceptable.
- Refactor in this order: guard clauses, extract a named function, lookup
  table instead of if chains, named predicates, flatten loops.
- Don't game the metric. A dense one-liner hiding six branches is worse than
  the honest if chain.
- A function whose name needs "and" does two things. Split it.
- `npm run complexity` prints the per-function table. Paste before and after
  numbers when you refactor.

## Writing (Caveman lite, plain English rules)

Applies to comments, UI strings, commits, README and REPORT.

- Short sentences, one idea each, about 20 words at most. Active voice.
- Everyday words. Keep every fact, name, number and path exact.
- No filler, hedging or pleasantries. No em dashes. No emoji.
- Banned: delve, leverage, seamless, robust, comprehensive, "in conclusion",
  "it is important to note", "this function is designed to". `npm run prose` checks.
- Comments say why. If a comment restates the code, delete it.
- Commits: one subject, imperative first line, a short paragraph on why. No trailers.

## Interface (Jakub Krehel's better-* skills)

- Accessibility: native elements, never `div onClick`. Every input has a
  `<label>`. Icon-only buttons have an `aria-label`. Visible `:focus-visible`
  rings. Validate on submit, don't disable submit. Status never by color
  alone. Targets at least 24x24px. Dialogs trap and return focus.
- Typography: unitless line-height (body 1.5, headings 1.2). Weight 400 or
  more below 18px. `tabular-nums` on scores, ages, incomes and counts.
  Inputs 16px on mobile. Prose capped at 60 to 75 characters.
- Color: tokens only, no literals in components. One filled primary action
  per view. Status hues at least 15 degrees from the accent hue.
- Layout: group with space, not lines. Align to shared edges. `minmax(0, 1fr)`
  on tracks that hold long text. `min-height`, never fixed heights on text.
- UI: press scales to 0.96 and never when disabled. Name transition
  properties, never `all`. Row hovers and other frequent changes get 150ms or
  less. Scrolling overlays get `overscroll-behavior: contain`.
- Writing in the UI: verb-first buttons ("Send match"). Errors say what failed
  and what to do. Empty states point to the next step. No "Oops", no
  "successfully", no "Please".

## Before every commit

`npm run check` runs typecheck, lint (with complexity), tests, prose and knip.
