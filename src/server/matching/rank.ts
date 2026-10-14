import type { PartnerPreferences } from "@/types/customer";
import type { Match, MatchList } from "@/types/match";
import type { Profile } from "@/types/profile";
import { ageFrom } from "@/lib/age";
import { templateExplanation } from "./explain";
import { passesDealbreakers, withinAgeRange } from "./filters";
import { mutualScore, scoreSide, tierFor, weightedTotal } from "./score";
import type { Other, Seeker } from "./types";
import { AGE_WIDEN_STEP, MATCHES_TO_SHOW, MAX_AGE_WIDENINGS, MIN_CANDIDATES } from "./weights";

function scorePair(seeker: Seeker, other: Other): Match {
  const factors = scoreSide(seeker, other);
  const customerSide = weightedTotal(factors);
  // The candidate's view of the customer, with their own gender's weights.
  const candidateSide = weightedTotal(scoreSide({ profile: other.profile, age: other.age }, seeker));
  const score = Math.round(mutualScore(customerSide, candidateSide) * 100);
  return {
    profile: other.profile,
    score,
    customerSide: Math.round(customerSide * 100),
    candidateSide: Math.round(candidateSide * 100),
    tier: tierFor(score),
    factors,
    explanation: templateExplanation(factors),
    explainedBy: "rules",
  };
}

// If the stated age range leaves too few people, widen it a little and say
// so. A matchmaker would rather see "widened by 2 years" than an empty list.
function shortlist(seeker: Seeker, pool: Other[], prefs: PartnerPreferences) {
  const eligible = pool.filter((other) => passesDealbreakers(seeker, other, prefs));
  let widenBy = 0;
  let inRange = eligible.filter((other) => withinAgeRange(other, prefs, widenBy));
  for (let step = 1; inRange.length < MIN_CANDIDATES && step <= MAX_AGE_WIDENINGS; step++) {
    widenBy = step * AGE_WIDEN_STEP;
    inRange = eligible.filter((other) => withinAgeRange(other, prefs, widenBy));
  }
  const relaxed = widenBy > 0 ? [`Age range widened by ${widenBy} years each side`] : [];
  return { candidates: inRange, relaxed };
}

export function rankMatches(customer: Profile, prefs: PartnerPreferences, pool: Profile[], today = new Date()): MatchList {
  const seeker: Seeker = { profile: customer, age: ageFrom(customer.dateOfBirth, today), preferences: prefs };
  const others = pool.map((profile) => ({ profile, age: ageFrom(profile.dateOfBirth, today) }));
  const { candidates, relaxed } = shortlist(seeker, others, prefs);
  const matches = candidates.map((other) => scorePair(seeker, other)).sort((a, b) => b.score - a.score);
  return {
    matches: matches.slice(0, MATCHES_TO_SHOW),
    poolSize: others.filter((other) => other.profile.gender !== customer.gender).length,
    passedFilters: candidates.length,
    relaxed,
  };
}
