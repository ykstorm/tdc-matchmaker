import type { PartnerPreferences } from "@/types/customer";
import type { FactorKey } from "@/types/match";
import type { Profile } from "@/types/profile";

// The person deciding, plus their stated preferences when we have them.
// Pool profiles are not customers, so when we score from their side the
// preferences are undefined and preference-only factors sit out.
export interface Seeker {
  profile: Profile;
  age: number;
  preferences?: PartnerPreferences;
}

export interface Other {
  profile: Profile;
  age: number;
}

export interface FactorResult {
  score: number;
  detail: string;
}

// Returns null when the factor does not apply to this pair.
export type Factor = (seeker: Seeker, other: Other) => FactorResult | null;

export type WeightTable = Partial<Record<FactorKey, number>>;
