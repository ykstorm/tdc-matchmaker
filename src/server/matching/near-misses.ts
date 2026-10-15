import type { PartnerPreferences } from "@/types/customer";
import type { NearMiss } from "@/types/match";
import { PREFERENCE_RULES, withinAgeRange } from "./filters";
import type { Other, Seeker } from "./types";

// People who fit everything except one of the customer's own rules. A
// matchmaker uses this to ask the right question: "would you consider
// someone of another faith? Nine more people would open up."
export function findNearMisses(seeker: Seeker, pool: Other[], prefs: PartnerPreferences, widenBy: number): NearMiss[] {
  const checks = [
    ...PREFERENCE_RULES.map((rule) => ({ rule: rule.label, passes: (other: Other) => rule.passes(seeker, other, prefs) })),
    { rule: "the age range", passes: (other: Other) => withinAgeRange(other, prefs, widenBy) },
  ];
  const counts = new Map<string, number>();
  for (const other of pool) {
    const failed = checks.filter((check) => !check.passes(other));
    if (failed.length !== 1) continue;
    counts.set(failed[0].rule, (counts.get(failed[0].rule) ?? 0) + 1);
  }
  return [...counts].map(([rule, count]) => ({ rule, count })).sort((a, b) => b.count - a.count);
}
