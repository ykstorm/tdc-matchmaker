import type { Profile } from "./profile";

export type FactorKey =
  | "age"
  | "income"
  | "height"
  | "kids"
  | "location"
  | "diet"
  | "career"
  | "relocation"
  | "values"
  | "education"
  | "lifestyle"
  | "horoscope";

export interface FactorScore {
  key: FactorKey;
  label: string;
  weight: number;
  score: number;
  detail: string;
}

export type MatchTier = "High Potential" | "Good Fit" | "Worth a Look";

export interface Match {
  profile: Profile;
  score: number;
  customerSide: number;
  candidateSide: number;
  tier: MatchTier;
  factors: FactorScore[];
  explanation: string;
  explainedBy: "ai" | "rules";
}

export interface NearMiss {
  rule: string;
  count: number;
}

export interface MatchList {
  matches: Match[];
  poolSize: number;
  passedFilters: number;
  relaxed: string[];
  nearMisses: NearMiss[];
}
