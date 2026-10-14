import type { FactorScore } from "@/types/match";

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function byImpact(a: FactorScore, b: FactorScore) {
  return b.weight * b.score - a.weight * a.score;
}

// The explanation a matchmaker reads when the AI is off or fails. Built from
// the same factor scores the ranking used, so it can never disagree with it.
export function templateExplanation(factors: FactorScore[]) {
  const strengths = [...factors].filter((f) => f.score >= 0.8).sort(byImpact).slice(0, 3);
  const concern = [...factors].filter((f) => f.score < 0.5).sort((a, b) => b.weight - a.weight)[0];
  const strong = strengths.map((f) => `${f.label.toLowerCase()} (${lowerFirst(f.detail)})`);
  const opening = strong.length
    ? `Strong on ${strong.join(", ")}.`
    : "No standout strengths, but nothing rules this out.";
  return concern ? `${opening} Watch ${concern.label.toLowerCase()}: ${lowerFirst(concern.detail)}.` : opening;
}
