import type { FactorKey } from "@/types/match";
import type { Gender } from "@/types/profile";
import { ageFactor, heightFactor } from "./factors/physical";
import { careerFactor, educationFactor, incomeFactor } from "./factors/money";
import { locationFactor, relocationFactor } from "./factors/place";
import { dietFactor, horoscopeFactor, kidsFactor, lifestyleFactor, valuesFactor } from "./factors/values";
import type { Factor, WeightTable } from "./types";

export const FACTORS: Record<FactorKey, { label: string; score: Factor }> = {
  age: { label: "Age", score: ageFactor },
  height: { label: "Height", score: heightFactor },
  income: { label: "Income", score: incomeFactor },
  career: { label: "Career", score: careerFactor },
  education: { label: "Education", score: educationFactor },
  location: { label: "Location", score: locationFactor },
  relocation: { label: "Relocation", score: relocationFactor },
  kids: { label: "Kids", score: kidsFactor },
  diet: { label: "Diet", score: dietFactor },
  values: { label: "Family values", score: valuesFactor },
  lifestyle: { label: "Lifestyle", score: lifestyleFactor },
  horoscope: { label: "Horoscope", score: horoscopeFactor },
};

// What a man is weighing. The brief: younger, earns less, shorter, same view
// on kids. Kids gets the top weight because it is the one that ends
// marriages; the other three are preferences families negotiate on.
const MALE_WEIGHTS: WeightTable = {
  kids: 20,
  age: 18,
  income: 14,
  height: 14,
  diet: 10,
  location: 10,
  values: 8,
  lifestyle: 6,
  horoscope: 8,
};

// What a woman is weighing. Career and stability first, then whether their
// plans for kids and family line up, then who moves where. Height and his
// age carry less here, which matches what women filter on in practice.
const FEMALE_WEIGHTS: WeightTable = {
  career: 18,
  kids: 16,
  values: 14,
  relocation: 14,
  education: 10,
  age: 10,
  diet: 8,
  location: 5,
  lifestyle: 5,
  horoscope: 8,
};

export function weightsFor(gender: Gender): WeightTable {
  return gender === "Male" ? MALE_WEIGHTS : FEMALE_WEIGHTS;
}

// The customer's own view counts for more than the candidate's, since the
// customer is the one we work for. 0.6 and 0.4 still let a lopsided pair sink.
export const CUSTOMER_SIDE_WEIGHT = 0.6;
export const CANDIDATE_SIDE_WEIGHT = 0.4;

export const MATCHES_TO_SHOW = 20;
export const MIN_CANDIDATES = 15;
export const AGE_WIDEN_STEP = 2;
export const MAX_AGE_WIDENINGS = 2;
