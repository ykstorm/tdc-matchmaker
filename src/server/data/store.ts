import type { CustomerRecord } from "@/types/customer";
import type { Profile } from "@/types/profile";
import customerSeed from "./customers.json";
import matchmakerSeed from "./matchmakers.json";
import profileSeed from "./profiles.json";

interface Matchmaker {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
}

interface SentEmail {
  to: string;
  subject: string;
  body: string;
  customerId: string;
  matchId: string;
  sentBy: string;
  sentAt: string;
}

// The whole store lives in memory, seeded from JSON. Good enough for a demo
// and honest about it: a serverless instance that restarts starts clean.
// Swapping this module for Postgres would not touch any service signature.
const profiles = profileSeed as Profile[];
const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
const customers = structuredClone(customerSeed) as CustomerRecord[];
const outbox: SentEmail[] = [];

export const store = {
  matchmakers: matchmakerSeed as Matchmaker[],
  profiles,
  profileById: (id: string) => profilesById.get(id),
  customers,
  outbox,
};
