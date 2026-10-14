import type { Diet, FamilyValues, Manglik, YesNoMaybe } from "@/types/profile";
import { average } from "../curves";
import type { Factor } from "../types";

function answerFit(a: YesNoMaybe, b: YesNoMaybe) {
  if (a === b) return 1;
  return a === "Maybe" || b === "Maybe" ? 0.5 : 0;
}

export const kidsFactor: Factor = (seeker, other) => {
  const mine = seeker.profile.wantKids;
  const theirs = other.profile.wantKids;
  const detail = mine === theirs ? `Both say ${mine.toLowerCase()} to kids` : `Kids: ${theirs} vs ${mine}`;
  return { score: answerFit(mine, theirs), detail };
};

const VEGETARIAN: Diet[] = ["Vegetarian", "Vegan", "Jain"];

function dietFit(a: Diet, b: Diet) {
  if (a === b) return 1;
  const vegA = VEGETARIAN.includes(a);
  const vegB = VEGETARIAN.includes(b);
  if (vegA && vegB) return 0.8;
  if (!vegA && !vegB) return 0.7;
  return a === "Eggetarian" || b === "Eggetarian" ? 0.5 : 0.2;
}

// Food decides whose kitchen works for whom, so families take it seriously.
export const dietFactor: Factor = (seeker, other) => ({
  score: dietFit(seeker.profile.diet, other.profile.diet),
  detail: other.profile.diet,
});

const VALUES_ORDER: FamilyValues[] = ["Traditional", "Moderate", "Liberal"];

export const valuesFactor: Factor = (seeker, other) => {
  const distance = Math.abs(
    VALUES_ORDER.indexOf(seeker.profile.familyValues) - VALUES_ORDER.indexOf(other.profile.familyValues),
  );
  const score = average([
    1 - distance * 0.5,
    answerFit(seeker.profile.openToPets, other.profile.openToPets),
    seeker.profile.familyType === other.profile.familyType ? 1 : 0.5,
  ]);
  return { score, detail: `${other.profile.familyValues} values, ${other.profile.familyType.toLowerCase()} family` };
};

export const lifestyleFactor: Factor = (seeker, other) => {
  const drinking = seeker.profile.drinking === other.profile.drinking ? 1 : 0.4;
  const smoking = seeker.profile.smoking === other.profile.smoking ? 1 : 0.3;
  return {
    score: average([drinking, smoking]),
    detail: `Drinks: ${other.profile.drinking}, smokes: ${other.profile.smoking}`,
  };
};

const MANGLIK_FIT: Record<Manglik, Record<Manglik, number>> = {
  Yes: { Yes: 1, Partial: 0.7, No: 0 },
  Partial: { Yes: 0.7, Partial: 1, No: 0.5 },
  No: { Yes: 0, Partial: 0.5, No: 1 },
};

// Only counted when the customer told us horoscope matters to the family.
export const horoscopeFactor: Factor = (seeker, other) => {
  if (!seeker.preferences?.horoscopeMatters) return null;
  return {
    score: MANGLIK_FIT[seeker.profile.manglik][other.profile.manglik],
    detail: `Manglik: ${other.profile.manglik}, rashi ${other.profile.rashi}`,
  };
};
