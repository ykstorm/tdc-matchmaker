import type { PartnerPreferences } from "@/types/customer";
import type { Diet } from "@/types/profile";
import type { Other, Seeker } from "./types";

const VEGETARIAN: Diet[] = ["Vegetarian", "Vegan", "Jain"];

// Dealbreakers. A candidate who fails any of these is never shown, however
// well they score. Everything else is a preference and lives in the score.
const RULES: ((seeker: Seeker, other: Other, prefs: PartnerPreferences) => boolean)[] = [
  (seeker, other) => seeker.profile.gender !== other.profile.gender,
  (seeker, other) => seeker.profile.id !== other.profile.id,
  (_seeker, other) => other.profile.verified,
  (seeker, other, prefs) => !prefs.sameReligionOnly || seeker.profile.religion === other.profile.religion,
  (_seeker, other, prefs) => prefs.openToDivorced || other.profile.maritalStatus === "Never Married",
  (_seeker, other, prefs) => !prefs.vegetarianOnly || VEGETARIAN.includes(other.profile.diet),
];

export function passesDealbreakers(seeker: Seeker, other: Other, prefs: PartnerPreferences) {
  return RULES.every((rule) => rule(seeker, other, prefs));
}

export function withinAgeRange(other: Other, prefs: PartnerPreferences, widenBy: number) {
  return other.age >= prefs.ageMin - widenBy && other.age <= prefs.ageMax + widenBy;
}
