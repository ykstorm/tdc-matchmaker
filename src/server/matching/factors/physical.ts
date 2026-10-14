import { bandScore } from "../curves";
import type { Factor } from "../types";

function yearsPhrase(years: number, direction: string) {
  if (years === 0) return "Same age";
  return `${years} year${years > 1 ? "s" : ""} ${direction}`;
}

// Men in this market look for a partner one to four years younger. Women
// look for someone the same age or up to four years older. Both preferences
// show up clearly in audits of Indian matrimony sites.
export const ageFactor: Factor = (seeker, other) => {
  const male = seeker.profile.gender === "Male";
  const gap = male ? seeker.age - other.age : other.age - seeker.age;
  const score = male ? bandScore(gap, 1, 4, 0.18) : bandScore(gap, 0, 4, 0.18);
  const direction = other.age < seeker.age ? "younger" : "older";
  return { score, detail: yearsPhrase(Math.abs(seeker.age - other.age), direction) };
};

// Scored only from the man's side: the brief asks for a shorter partner, and
// 8 to 20 cm (about 3 to 8 inches) is the band most families ask for.
export const heightFactor: Factor = (seeker, other) => {
  const gap = seeker.profile.heightCm - other.profile.heightCm;
  const detail = gap >= 0 ? `${gap} cm shorter` : `${-gap} cm taller`;
  return { score: bandScore(gap, 8, 20, 0.06), detail };
};
