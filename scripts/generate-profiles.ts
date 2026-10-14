// Writes the seed data the app reads at startup: the profile pool, the
// customers each matchmaker owns, and the two matchmaker logins.
// Run with `npm run seed`. Same seed, byte-identical output.

import { existsSync, writeFileSync } from "node:fs";
import { hashSync } from "bcryptjs";

import type { CustomerRecord, CustomerStatus, Note, PartnerPreferences } from "../src/types/customer";
import type { Gender, Profile } from "../src/types/profile";
import { buildProfile } from "./seed/build-profile";
import { createRandom, type Random } from "./seed/random";

const SEED = 20261014;
const PER_GENDER = 150;
const CUSTOMERS_PER_MATCHMAKER = 12;
const OUT = "src/server/data";

const MATCHMAKERS = [
  { id: "m1", username: "priya", password: "priya123", name: "Priya Sharma" },
  { id: "m2", username: "arjun", password: "arjun123", name: "Arjun Mehta" },
];

const NOTE_LINES = [
  "First call done. Family wants someone settled in the same city for the first few years.",
  "Parents are flexible on caste, firm on diet. Mentioned twice.",
  "Wants a partner who is ambitious but not married to work. Said weekends matter.",
  "Met in person. Warm, a little reserved at first. Opened up when we talked about travel.",
  "Asked us to hold for a month, exams at work. Follow up after the 20th.",
];

function preferencesFor(random: Random, profile: Profile, age: number): PartnerPreferences {
  const male = profile.gender === "Male";
  const vegetarian = ["Vegetarian", "Vegan", "Jain"].includes(profile.diet);
  return {
    ageMin: male ? Math.max(21, age - 6) : age - 1,
    ageMax: male ? age : age + 6,
    sameReligionOnly: random.chance(0.8),
    openToDivorced: profile.maritalStatus !== "Never Married" || random.chance(0.25),
    vegetarianOnly: vegetarian && random.chance(0.5),
    horoscopeMatters: profile.religion === "Hindu" && random.chance(0.4),
  };
}

function notesFor(random: Random, status: CustomerStatus, author: string): Note[] {
  if (status === "New") return [];
  return random.sample(NOTE_LINES, 1 + Math.floor(random.next() * 2)).map((text, i) => ({
    id: `n${Math.floor(random.next() * 1e8)}`,
    text,
    author,
    createdAt: new Date(Date.UTC(2026, 8, 5 + i * 9)).toISOString(),
  }));
}

function ageOf(profile: Profile) {
  return 2026 - Number(profile.dateOfBirth.slice(0, 4));
}

function pickCustomers(random: Random, pool: Profile[]): CustomerRecord[] {
  const men = pool.filter((p) => p.gender === "Male" && p.verified);
  const women = pool.filter((p) => p.gender === "Female" && p.verified);
  const half = CUSTOMERS_PER_MATCHMAKER / 2;
  return MATCHMAKERS.flatMap((matchmaker, m) => {
    const owned = [...men.slice(m * half, (m + 1) * half), ...women.slice(m * half, (m + 1) * half)];
    return owned.map((profile, i) => {
      const status = random.weighted<CustomerStatus>({ New: 3, Matching: 4, Introduced: 2, "On Hold": 1 });
      return {
        profileId: profile.id,
        matchmakerId: matchmaker.id,
        status,
        joinedAt: new Date(Date.UTC(2026, 7, 1 + i * 3)).toISOString(),
        preferences: preferencesFor(random, profile, ageOf(profile)),
        notes: notesFor(random, status, matchmaker.name),
        sentMatchIds: [],
      };
    });
  });
}

function writeJson(name: string, data: unknown) {
  writeFileSync(`${OUT}/${name}`, JSON.stringify(data, null, 2) + "\n");
}

function main() {
  const random = createRandom(SEED);
  const genders = Array.from({ length: PER_GENDER * 2 }, (_, i): Gender => (i % 2 === 0 ? "Male" : "Female"));
  const pool = genders.map((gender, i) => buildProfile(random, gender, i + 1));
  const customers = pickCustomers(random, pool);
  writeJson("profiles.json", pool);
  writeJson("customers.json", customers);

  // bcrypt salts are random, so rewriting this file would change it on every
  // run without any real change. Write it once.
  if (!existsSync(`${OUT}/matchmakers.json`)) {
    const matchmakers = MATCHMAKERS.map(({ password, ...rest }) => ({ ...rest, passwordHash: hashSync(password, 10) }));
    writeJson("matchmakers.json", matchmakers);
  }
  console.log(`${pool.length} profiles, ${customers.length} customers`);
}

main();
