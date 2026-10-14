import type { EducationLevel, Profession } from "@/types/profile";
import { bandScore, clamp01 } from "../curves";
import type { Factor } from "../types";

function lakhs(value: number) {
  return `₹${value} L`;
}

// From the man's side: the brief asks for a partner who earns less. A ratio
// of 0.45 to 0.95 scores full. Far below that usually means a very different
// stage of life, so it falls off too.
export const incomeFactor: Factor = (seeker, other) => {
  const ratio = other.profile.incomeLakhs / seeker.profile.incomeLakhs;
  const detail = `Earns ${lakhs(other.profile.incomeLakhs)} vs ${lakhs(seeker.profile.incomeLakhs)}`;
  return { score: bandScore(ratio, 0.45, 0.95, 1.4), detail };
};

const RELATED_FIELDS: Profession[][] = [
  ["Technology", "Design", "Consulting"],
  ["Finance", "Consulting", "Business"],
  ["Law", "Government", "Finance"],
  ["Education", "Government", "Medicine"],
];

function fieldFit(a: Profession, b: Profession) {
  if (a === b) return 1;
  return RELATED_FIELDS.some((group) => group.includes(a) && group.includes(b)) ? 0.7 : 0.4;
}

// From the woman's side: does he earn at least as much, and does his work sit
// close enough to hers that they understand each other's days. No penalty for
// earning more.
export const careerFactor: Factor = (seeker, other) => {
  const ratio = other.profile.incomeLakhs / seeker.profile.incomeLakhs;
  const pay = clamp01(1 - (1 - ratio) * 1.5);
  const field = fieldFit(seeker.profile.profession, other.profile.profession);
  const detail = `${other.profile.designation}, ${other.profile.profession.toLowerCase()}, ${lakhs(other.profile.incomeLakhs)}`;
  return { score: 0.7 * pay + 0.3 * field, detail };
};

const EDUCATION_RANK: Record<EducationLevel, number> = { Bachelors: 1, Masters: 2, Doctorate: 3 };

export const educationFactor: Factor = (seeker, other) => {
  const gap = EDUCATION_RANK[other.profile.educationLevel] - EDUCATION_RANK[seeker.profile.educationLevel];
  return { score: clamp01(1 + gap * 0.5), detail: other.profile.degree };
};
