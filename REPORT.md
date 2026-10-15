# TDC Matchmaker: how it works

This is the write-up for the matchmaker dashboard assignment. The first part
is for anyone. The last part, "For engineers", has the file paths and the
numbers.

## What it does

A matchmaker signs in and sees the customers they look after. Opening a
customer shows their full biodata, laid out the way an Indian biodata is
usually laid out: personal details, education and career, family and
background, lifestyle, and what they want in a partner. Next to it is a list
of suggested matches, best first, each with a score and a short note on why
it could work. The matchmaker can write notes from calls, change the
customer's stage (New, Matching, Introduced, On Hold) and send a match with
an email they can edit first.

## Where the profiles come from

There are 300 made-up people: 150 women and 150 men. The brief asked for at
least 100. I made more so that smaller communities, like a Jain or Christian
customer who wants someone of the same faith, still get real choices.

They aren't random. A script builds each person from a community, so the
pieces fit: a Reddy lives in Hyderabad and speaks Telugu, a Jain is
vegetarian, and pay goes up with age and depends on the job. The script uses
a fixed starting number, so it makes the same 300 people every time.

24 of the 300 are customers, 12 for each matchmaker. Everyone else is a
possible match.

## How a match is picked

Think of it as three steps.

**Step 1: rule out the impossible.** Some things a customer has told us are
dealbreakers. If they only want someone of the same religion, or won't
consider someone divorced, or want a vegetarian partner, anyone who breaks
that is never shown. We also only suggest verified profiles. The customer's
age range is the one thing that can stretch. If it leaves fewer than 15
people, the range widens by 2 years and the screen says so, instead of
showing an empty list.

**Step 2: score what's left.** Each person gets a score out of 100, built
from things like age gap, income, height, whether they want kids, diet,
family values, city, and whether they'd move. What counts most depends on
who is looking, because men and women in Indian matchmaking weigh different
things.

| What matters most | When a man is looking | When a woman is looking |
|---|---|---|
| First | Same answer on kids | Career and income |
| Then | She's a little younger | Same answer on kids |
| Then | She earns a bit less | Family values line up |
| Then | She's a bit shorter | Willing to relocate |
| Also counted | Diet, city, family values, habits | Education, age, diet, city, habits |

The man's list follows the brief. Kids sits at the top because it's the one
difference that's hard to settle after the wedding. For women, career and
relocation weigh more, because in most Indian families she is the one who
moves after marriage. Horoscope counts only when the customer says it
matters to the family.

**Step 3: check it works both ways.** This is the part I'd point to as new.
Most matching only asks "is this person right for my customer?" But a match
only happens if both people say yes. So every pair is scored twice: once
from the customer's side and once from the other person's side, using that
person's own priorities. The two scores are then combined in a way that
punishes one-sided matches.

An example. Say person A looks great for the customer (95) but the customer
is a poor fit for A (35). A simple average gives 65. Another person, B, is a
decent fit both ways (65 and 65), also averaging 65. A matchmaker would pick
B, because B is likely to say yes. The app does too: it multiplies the two
scores instead of averaging them, so A ends up just below B. Every match
card shows both sides, so the matchmaker can spot a lopsided match before
sending it.

Final labels: 85 and above is "High Potential", 72 and above is "Good Fit",
and the rest is "Worth a Look".

## Who almost made it

Under the matches, the app also lists the people who fit everything except
one of the customer's own rules, grouped by rule. For example: "100 people
fit everything except the same-religion rule."

This is what a good matchmaker does in their head. When a customer's list is
thin, the useful question isn't "who else is out there?" but "which of your
rules is costing you the most?" In the test data, one Christian customer
has only 4 matches, but 100 more people would open up if they were open to
another faith. That turns a dead end into a conversation the matchmaker can
have on the next call.

Nobody is shown or contacted because of this. It's only a count, and the
customer's rules still decide.

## Where AI comes in

After the three steps, the top 20 matches go to an AI model in one go. It's
an open model (`openai/gpt-oss-20b`) running on Groq's free tier, so it
costs nothing. No paid OpenAI account is involved.

The AI reads both profiles the way a person would. It looks for things the
scoring can't see: shared hobbies, whether their "about me" lines sound like
they'd get on, whether the families would mix well. For each match it writes
two or three sentences for the matchmaker: the best reason this could work,
and the one thing to check before introducing them. It can also nudge the
order a little.

The AI is kept on a short leash:

- It can move a score by 8 points at most. It can swap close calls, but it
  can't push forward someone the rules turned down.
- It never sees surnames, emails or phone numbers. It doesn't need them.
- If it's slow, gives a bad answer, or isn't available, the app quietly uses
  the step 2 and 3 scores and writes the note from them instead. The demo
  never breaks because of the AI.

The card says which kind of note you're reading.

## Assumptions I made

- Customers are matched with the opposite gender, as the brief describes.
- What a customer states as a must-have is a dealbreaker. Everything else
  is a preference that raises or lowers the score.
- The matchmaker decides. The app only suggests and never sends anything on
  its own.
- Incomes are yearly, in lakhs of rupees. Heights are shown in feet and
  inches as well as cm, because that's how families talk about height.
- I added the fields an Indian biodata usually has that the brief didn't
  list: diet, mother tongue, gotra, manglik, rashi, family type and values,
  parents' work, drinking and smoking, hobbies, and a short "about me".

## What I left out

- **No database.** Everything lives in the app's memory. Notes, stage
  changes and sent matches reset when the server restarts, which on Vercel
  can happen between visits. Adding a real database would change one file.
- **No real email.** Send match writes the email to the server log instead
  of sending it.
- **No sign-up or password reset.** There are two ready-made matchmaker
  accounts: `priya` / `priya123` and `arjun` / `arjun123`.
- **No AI-written emails.** The intro email is a template the matchmaker
  edits. I kept the AI focused on ranking, which is the part the brief
  requires.

## For engineers

**Stack.** Next.js 16 (pages plus route handlers as the API), TypeScript,
Tailwind 4, shadcn/ui on Radix, zod for input checks, jose and bcryptjs for
sign-in, Groq through the OpenAI SDK.

**Where things are.**

| Part | File |
|---|---|
| Dealbreakers | `src/server/matching/filters.ts` |
| One function per scoring factor | `src/server/matching/factors/` |
| Weights by gender, and why | `src/server/matching/weights.ts` |
| Two-sided score and labels | `src/server/matching/score.ts` |
| Ranking and age widening | `src/server/matching/rank.ts` |
| Who almost made it | `src/server/matching/near-misses.ts` |
| AI review, 8-point cap, fallback | `src/server/ai/rerank.ts`, `src/server/ai/groq.ts` |
| Profile generator | `scripts/generate-profiles.ts`, `scripts/seed/` |
| Sign-in and page guard | `src/server/services/auth-service.ts`, `src/proxy.ts` |
| Tests | `tests/` |

**Request flow.** Sign-in checks a bcrypt hash and sets a signed JWT in an
httpOnly cookie. `src/proxy.ts` sends anyone without one back to `/login`.
API routes check the cookie themselves and parse input with zod. A
matchmaker asking for another matchmaker's customer gets the same 404 as
for one that doesn't exist. The two-sided score is
`customerSide^0.6 × candidateSide^0.4`. A test in `tests/rank.test.ts`
checks the one-sided example above.

**Checks.** `npm run check` runs all of these, and all pass:

- TypeScript with no errors.
- ESLint fails any function over cyclomatic complexity 10, over 40 lines,
  or any file over 200 lines. Highest complexity today is 8.
- `@shadcn/lint` fails raw colors, one-off values like `p-[13px]`, and
  restyling a component from outside. The first run found 53 issues, all
  fixed.
- 18 unit tests on the factors, the ranker and the near-miss counts.
- knip finds no unused files, exports or dependencies.
- A word check fails on em dashes and filler words.

**Accessibility.** Text contrast is 15.8:1, and muted text is 5.8:1. Status
badges and input borders were darkened until they passed WCAG, and every
status shows a word, not only a color. Every field has a label. The send
dialog traps and returns keyboard focus. Button motion turns off when the
system asks for reduced motion.
