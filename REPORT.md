# TDC Matchmaker: how it works and why

This is the write-up for the matchmaker dashboard assignment. It covers the
matching algorithm, how AI is used, the assumptions I made, what I left out,
and the numbers I checked before calling it done.

## 1. Request flow

1. A matchmaker signs in at `/login`. `src/app/api/auth/login/route.ts` checks
   the password against a bcrypt hash (`src/server/services/auth-service.ts`)
   and sets a signed JWT in an httpOnly cookie (`src/server/token.ts`).
2. `src/proxy.ts` runs before every page. No valid cookie means a redirect to
   `/login`. API routes check the cookie themselves and answer 401.
3. `/dashboard` (`src/app/dashboard/page.tsx`) lists only that matchmaker's
   customers through `listCustomers` in `src/server/services/customer-service.ts`.
4. `/customer/[id]` (`src/app/customer/[id]/page.tsx`) shows the biodata,
   journey status and call notes. Asking for another matchmaker's customer
   returns the same 404 as a customer that doesn't exist.
5. The match panel calls `GET /api/customers/[id]/matches`. `match-service.ts`
   runs the rule-based ranking (`src/server/matching/rank.ts`), then sends the
   top 20 to Groq for review (`src/server/ai/rerank.ts`).
6. Send match opens a dialog with an editable email
   (`src/lib/intro-email.ts`). Confirming calls `POST /api/match/send`, which
   logs a mock email, records the match as sent and moves the customer to
   Introduced.

Route handlers stay thin. They parse input with zod (`src/server/schemas.ts`),
call one service and return. Errors map to status codes in one place,
`src/server/http.ts`.

## 2. The matching algorithm

Matching runs in three passes.

**Pass 1, dealbreakers.** A candidate is dropped if they are the same gender,
unverified, or break one of the customer's stated partner preferences: same
religion only, open to divorced or not, vegetarian only. These never bend,
because a matchmaker who sends someone outside a stated dealbreaker loses
the customer's trust. Age range is the one soft filter. If fewer than 15
people fit, the range widens by 2 years each side, up to twice, and the panel
says so. A Sikh or Christian customer with a same-religion filter would
otherwise see an empty list.

**Pass 2, weighted score from both sides.** Each factor is a small pure
function in `src/server/matching/factors/` that returns a 0 to 1 score and a
short reason ("5 years younger", "Both say yes to kids"). The weights depend
on who is looking (`src/server/matching/weights.ts`):

| Factor | Man looking | Woman looking | How it scores |
|---|---|---|---|
| Kids | 20 | 16 | Same answer full, one Maybe half, Yes vs No zero |
| Age | 18 | 10 | Man: she is 1 to 4 years younger. Woman: he is 0 to 4 years older |
| Income | 14 | | She earns 45 to 95 percent of what he earns |
| Height | 14 | | She is 8 to 20 cm shorter |
| Career | | 18 | He earns at least as much, no penalty for more, plus related field |
| Family values | 8 | 14 | Values, family type and pets lined up |
| Relocation | | 14 | Same city full, otherwise how willing each one is to move |
| Education | | 10 | Same level or higher |
| Diet | 10 | 8 | Same diet full, two vegetarian diets close, veg and non-veg far |
| Location | 10 | 5 | Same city, same state, then willingness to move |
| Lifestyle | 6 | 5 | Drinking and smoking match |
| Horoscope | 8 | 8 | Manglik match, only when the customer says it matters |

The man's weights follow the brief: younger, earns less, shorter, same view
on kids. Kids gets the top weight because it's the one difference that's hard
to negotiate after marriage. The other three are preferences families bend on. The
woman's weights put career, kids, family values and relocation first. In
Indian families the woman usually moves after marriage, so relocation is a
real question for her and a minor one for him. Factors that don't apply drop
out and the remaining weights are rescaled, so nobody is marked down for a
question that doesn't concern them.

**The part I'd call new: reciprocal scoring.** Most matching code scores a
pair once, from the customer's side. That misses half the problem. A match
only works if both people say yes. So every pair is scored twice. Once from
the customer's side with their gender's weights and stated preferences, and
once from the candidate's side with the candidate's gender's weights. The
two are combined with a weighted geometric mean:

```
score = customerSide^0.6 × candidateSide^0.4
```

The customer's view counts for more, since they are the one we work for.
The geometric mean matters more than the weights. With a plain average, a
95 from the customer could hide a 20 from the candidate. Multiplying makes a
one-sided match sink. Example: 0.95 and 0.35 average to 0.65, but their
geometric mean is about 0.64, below a balanced 0.65 and 0.65 pair (there's a
test for exactly that in `tests/rank.test.ts`). The match card shows both
numbers, "fit from your customer's side" and "from her side", so a
matchmaker can see when a match is lopsided before sending it.

Final score bands: 85 and up is High Potential, 72 and up is Good Fit, the
rest is Worth a Look.

## 3. How AI is used

The top 20 from pass 2 go to Groq in one call
(`openai/gpt-oss-20b`, free tier, set by `GROQ_MODEL`). The model gets the
customer, each candidate's rule score and the factor breakdown. It is asked
to read the two people as people, looking for what the numbers miss: shared
hobbies, how their "about" lines sound together, whether their families
would get on, a soft clash the rules scored as fine. It returns strict JSON
with an adjusted score and a two or three sentence note for the matchmaker:
the strongest reason this could work and the one thing to check first.

Three guardrails keep it honest.

- The model can move a score by 8 points at most
  (`MAX_SHIFT` in `src/server/ai/rerank.ts`). It can reorder close calls. It
  can't rescue a match the rules rejected or bury one they loved.
- The reply is validated with zod. A malformed reply, a timeout, a missing
  key or a rate limit all fall back to the rule-based ranking and a templated
  explanation built from the same factor scores. The demo never breaks
  because of the AI.
- The model never sees a surname, email or phone number
  (`profileBrief` in `src/server/ai/groq.ts`). It doesn't need them to judge
  fit, so they never leave the server.

Why re-ranking instead of letting the model score from scratch: the rules
are explainable, testable and consistent. An 8B or 20B model asked to score
300 profiles cold is none of those. So the rules do the heavy lifting and the
model does the one thing rules can't, which is read the profiles as text.
Each AI review is cached per customer and shortlist, so reopening a profile
doesn't spend the free-tier quota again.

## 4. Assumptions

- Customers are matched with the opposite gender only. The brief frames it
  that way and I kept that for the MVP.
- Partner preferences are stated by the customer and treated as dealbreakers.
  Everything else is a preference and lives in the score.
- The matchmaker has final say. The algorithm suggests. It never sends
  anything on its own.
- Only verified profiles are suggested. The brief says matchmakers work with
  verified profiles.
- Incomes are annual, in lakhs of rupees. Heights are stored in cm and shown
  in feet and inches too, because that's how families talk about height.
- The pool is 300 generated profiles (150 men, 150 women). Each matchmaker
  owns 12 customers. `npm run seed` regenerates the same data every time from
  a fixed seed (`scripts/generate-profiles.ts`). Names, cities, castes,
  languages and diets are generated per community, so a Reddy lives in
  Hyderabad and speaks Telugu rather than landing in Amritsar.
- I added the fields Indian biodata usually carries beyond the brief's list:
  diet, mother tongue, gotra, manglik, rashi, family type and values, parents'
  occupations, drinking and smoking, hobbies and a short about line.

## 5. What I did not do

- **No database.** The store is in memory, seeded from JSON
  (`src/server/data/store.ts`). Notes, status changes and sent matches reset
  when the server restarts. On Vercel that can happen between visits. Moving
  to Postgres changes that one file, not the services.
- **No real email.** Send match logs the email to the server log and keeps it
  in an in-memory outbox.
- **No sign-up or password reset.** Two matchmaker accounts are seeded.
- **No light or dark switch.** One warm light theme.
- **No AI-written intro emails.** The email is a template the matchmaker
  edits. I cut AI here to keep the AI work focused on ranking, which is the
  assignment's mandatory part.

## 6. Quality checks

`npm run check` runs all of these, and all pass.

- **Types:** `tsc --noEmit` clean.
- **Lint:** ESLint fails any function over cyclomatic complexity 10, any
  function over 40 lines and any file over 200 lines.
- **Design system:** `@shadcn/lint` fails raw colors, arbitrary values like
  `p-[13px]`, and restyling a component with `className`. Turning it on found
  53 issues. Fixing them meant theme tokens for letter spacing, plain
  wrappers for layout, and a real button size for inline links. The vendored
  primitives keep upstream shadcn's exact values, so that one rule skips them.
- **Complexity:** 260 functions. Highest is 8 (`dietFit`). Five sit between 6
  and 8. None over 10. `npm run complexity` prints the table.
- **Tests:** 17 unit tests on the factors and the ranker: dealbreakers,
  the age, height and income bands, the kids clash, age widening, and the
  reciprocal score sinking one-sided matches.
- **Dead code:** knip reports no unused files, exports or dependencies.
- **Writing:** `npm run prose` fails on em dashes and a list of filler words.

Interface review, against Jakub Krehel's better-* rules:

| Check | Result |
|---|---|
| Contrast, text on background | 15.8:1 body, 5.8:1 muted text |
| Status badge text on its tint | 5.4 to 5.8:1, after darkening them from 3.6 to 4.7:1 |
| Input borders (WCAG 1.4.11, 3:1) | 3.7:1, after raising them from 1.4:1 |
| Status by color alone | No. Every status and tier shows its label |
| Keyboard path | Customer names are real links. Dialog traps and returns focus |
| Labels | Every input has a label. Errors sit in live regions rendered from the start |
| Motion | Button press scales to 0.96, only when enabled and when reduced motion is off |
| Numbers | Scores, ages and counts use tabular figures |

Not verified: I couldn't run a browser in the build sandbox, so I haven't
checked layout at 320px width or 200% zoom by eye. That check gets done on
the live URL.
