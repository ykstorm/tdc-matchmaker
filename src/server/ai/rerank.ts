import { z } from "zod";

import type { Match } from "@/types/match";
import type { Profile } from "@/types/profile";
import { tierFor } from "../matching/score";
import { askForJson, profileBrief } from "./groq";

const RERANK_PROMPT = `You help a matchmaker at an Indian matchmaking service.
You get one customer and a shortlist of candidates. Each candidate already has a
rule-based score from 0 to 100 and the factor breakdown behind it.

Read both people as people. Look for what the numbers miss: shared hobbies,
how their "about" lines sound together, whether their families would get on,
whether their careers fit the life each one describes, a soft clash the rules
scored as fine.

For every candidate return an adjustedScore within 8 points of their rule score
and an explanation for the matchmaker. The explanation is one short paragraph of
two or three sentences in plain words, no flattery. Say the strongest reason
this could work and the one thing to check before introducing them. Do not
repeat the numbers back.

Reply with JSON only:
{"matches":[{"profileId":"...","adjustedScore":0,"explanation":"..."}]}`;

const replySchema = z.object({
  matches: z.array(
    z.object({ profileId: z.string(), adjustedScore: z.number(), explanation: z.string().min(1) }),
  ),
});

// The rule score sets the floor and ceiling. The model can move a match a
// few places, never rescue one the rules rejected or bury one they loved.
const MAX_SHIFT = 8;

function applyReview(match: Match, review: z.infer<typeof replySchema>["matches"][number] | undefined): Match {
  if (!review) return match;
  const low = match.score - MAX_SHIFT;
  const high = match.score + MAX_SHIFT;
  const score = Math.round(Math.min(high, Math.max(low, review.adjustedScore)));
  return { ...match, score, tier: tierFor(score), explanation: review.explanation.trim(), explainedBy: "ai" };
}

export async function rerankWithAi(customer: Profile, matches: Match[]): Promise<Match[] | null> {
  const reply = await askForJson(RERANK_PROMPT, {
    customer: profileBrief(customer),
    candidates: matches.map((m) => ({
      ...profileBrief(m.profile),
      ruleScore: m.score,
      factors: m.factors.map((f) => `${f.label}: ${f.detail} (${Math.round(f.score * 100)})`),
    })),
  });
  if (reply === null) return null;
  const reviews = new Map(replySchema.parse(reply).matches.map((r) => [r.profileId, r]));
  return matches.map((m) => applyReview(m, reviews.get(m.profile.id))).sort((a, b) => b.score - a.score);
}
