import type { PartnerPreferences } from "@/types/customer";
import type { Diet } from "@/types/profile";
import type { Other, Seeker } from "./types";

const VEGETARIAN: Diet[] = ["Vegetarian", "Vegan", "Jain"];

type Rule = (seeker: Seeker, other: Other, prefs: PartnerPreferences) => boolean;

// Never negotiable, so never reported as a near miss.
const BASE_RULES: Rule[] = [
  (seeker, other) => seeker.profile.gender !== other.profile.gender,
  (seeker, other) => seeker.profile.id !== other.profile.id,
  (_seeker, other) => other.profile.verified,
];

// Dealbreakers the customer chose. A candidate who fails one is never shown,
// however well they score. The label is what the matchmaker reads when
// someone missed out on this rule alone.
export const PREFERENCE_RULES: { label: string; passes: Rule }[] = [
  {
    label: "the same-religion rule",
    passes: (seeker, other, prefs) => !prefs.sameReligionOnly || seeker.profile.religion === other.profile.religion,
  },
  {
    label: "the never-married rule",
    passes: (_seeker, other, prefs) => prefs.openToDivorced || other.profile.maritalStatus === "Never Married",
  },
  {
    label: "the vegetarian-only rule",
    passes: (_seeker, other, prefs) => !prefs.vegetarianOnly || VEGETARIAN.includes(other.profile.diet),
  },
];

export function passesBaseRules(seeker: Seeker, other: Other, prefs: PartnerPreferences) {
  return BASE_RULES.every((rule) => rule(seeker, other, prefs));
}

export function passesPreferences(seeker: Seeker, other: Other, prefs: PartnerPreferences) {
  return PREFERENCE_RULES.every((rule) => rule.passes(seeker, other, prefs));
}

export function withinAgeRange(other: Other, prefs: PartnerPreferences, widenBy: number) {
  return other.age >= prefs.ageMin - widenBy && other.age <= prefs.ageMax + widenBy;
}
