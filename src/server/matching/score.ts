import type { FactorKey, FactorScore, MatchTier } from "@/types/match";
import { CANDIDATE_SIDE_WEIGHT, CUSTOMER_SIDE_WEIGHT, FACTORS, weightsFor } from "./weights";
import type { Other, Seeker } from "./types";

// Runs every weighted factor from one person's point of view. Factors that
// do not apply drop out and the remaining weights are renormalised, so a
// pair is never punished for a question that does not concern them.
export function scoreSide(seeker: Seeker, other: Other): FactorScore[] {
  const weights = weightsFor(seeker.profile.gender);
  const results: FactorScore[] = [];
  for (const [key, weight] of Object.entries(weights) as [FactorKey, number][]) {
    const result = FACTORS[key].score(seeker, other);
    if (result) results.push({ key, label: FACTORS[key].label, weight, ...result });
  }
  const total = results.reduce((sum, factor) => sum + factor.weight, 0);
  return results.map((factor) => ({ ...factor, weight: Math.round((factor.weight / total) * 100) }));
}

export function weightedTotal(factors: FactorScore[]) {
  const total = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const earned = factors.reduce((sum, factor) => sum + factor.weight * factor.score, 0);
  return total === 0 ? 0 : earned / total;
}

// Weighted geometric mean of both sides. With a plain average, a 95 from the
// customer could hide a 20 from the candidate. Multiplying makes a one-sided
// match score low, which is what a matchmaker wants to see.
export function mutualScore(customerSide: number, candidateSide: number) {
  return customerSide ** CUSTOMER_SIDE_WEIGHT * candidateSide ** CANDIDATE_SIDE_WEIGHT;
}

export function tierFor(score: number): MatchTier {
  if (score >= 85) return "High Potential";
  if (score >= 72) return "Good Fit";
  return "Worth a Look";
}
