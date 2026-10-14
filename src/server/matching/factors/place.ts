import type { YesNoMaybe } from "@/types/profile";
import type { Factor } from "../types";

const OPENNESS: Record<YesNoMaybe, number> = { Yes: 1, Maybe: 0.5, No: 0 };

export const locationFactor: Factor = (seeker, other) => {
  if (seeker.profile.city === other.profile.city) return { score: 1, detail: `Both in ${other.profile.city}` };
  if (seeker.profile.state === other.profile.state) return { score: 0.6, detail: `Same state, ${other.profile.city}` };
  const willMove = Math.max(OPENNESS[seeker.profile.openToRelocate], OPENNESS[other.profile.openToRelocate]);
  return { score: 0.1 + 0.3 * willMove, detail: `Lives in ${other.profile.city}` };
};

// Distance only hurts when nobody is willing to move.
export const relocationFactor: Factor = (seeker, other) => {
  if (seeker.profile.city === other.profile.city) return { score: 1, detail: "Same city, no move needed" };
  const score = (OPENNESS[seeker.profile.openToRelocate] + OPENNESS[other.profile.openToRelocate]) / 2;
  return { score, detail: `Open to relocate: ${other.profile.openToRelocate}` };
};
