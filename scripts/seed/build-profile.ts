import type { Diet, EducationLevel, Gender, Manglik, Profession, Profile } from "../../src/types/profile";
import { CAREERS, FATHER_JOBS, HOBBIES, MOTHER_JOBS } from "./careers";
import { COMMUNITIES, GOTRAS, RASHIS, type Community } from "./communities";
import type { Random } from "./random";

// Ages are anchored to a fixed date so the JSON does not drift between runs.
const REFERENCE_YEAR = 2026;

function pickCommunity(random: Random): Community {
  const shares = Object.fromEntries(COMMUNITIES.map((c, i) => [String(i), c.share]));
  return COMMUNITIES[Number(random.weighted(shares))];
}

function pickProfession(random: Random): Profession {
  const shares = Object.fromEntries(Object.entries(CAREERS).map(([key, c]) => [key, c.share]));
  return random.weighted(shares) as Profession;
}

function birthDate(random: Random, gender: Gender) {
  const meanAge = gender === "Male" ? 30 : 27.5;
  const age = Math.round(Math.min(40, Math.max(23, random.normal(meanAge, 3.6))));
  const month = 1 + Math.floor(random.next() * 12);
  const day = 1 + Math.floor(random.next() * 28);
  const date = `${REFERENCE_YEAR - age}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { age, date };
}

function pickDiet(random: Random, community: Community): Diet {
  if (community.religion === "Jain") return random.chance(0.7) ? "Jain" : "Vegetarian";
  if (random.chance(community.vegetarianShare)) return random.chance(0.9) ? "Vegetarian" : "Vegan";
  return random.chance(0.75) ? "Non-vegetarian" : "Eggetarian";
}

function income(random: Random, profession: Profession, age: number) {
  const career = CAREERS[profession];
  const expected = career.startingLakhs + career.yearlyRaiseLakhs * Math.max(0, age - 23);
  // Pay is skewed: most people sit near the middle, a few earn far more.
  const spread = Math.exp(random.normal(0, 0.28));
  return Math.round(expected * spread * 2) / 2;
}

function career(random: Random, profession: Profession, age: number) {
  const plan = CAREERS[profession];
  const educationLevel = random.weighted<EducationLevel>({ Bachelors: 48, Masters: 44, Doctorate: 8 });
  const seniority = age < 28 ? 0 : age < 33 ? 1 : 2;
  return {
    profession,
    educationLevel,
    degree: plan.degrees[educationLevel],
    college: random.pick(plan.colleges),
    company: random.pick(plan.companies),
    designation: plan.titles[seniority],
    incomeLakhs: income(random, profession, age),
  };
}

function horoscope(random: Random, community: Community) {
  const vedic = community.religion === "Hindu" || community.religion === "Jain";
  const manglik: Manglik = vedic ? random.weighted<Manglik>({ No: 70, Yes: 20, Partial: 10 }) : "No";
  return {
    gotra: vedic ? random.pick(GOTRAS) : "Not applicable",
    rashi: vedic ? random.pick(RASHIS) : "Not applicable",
    manglik,
  };
}

function languages(community: Community) {
  const known = new Set([community.motherTongue, "English"]);
  if (community.motherTongue !== "Tamil" && community.motherTongue !== "Malayalam") known.add("Hindi");
  return [...known];
}

function maritalStatus(random: Random, age: number) {
  if (age < 27) return "Never Married";
  return random.weighted({ "Never Married": 86, Divorced: 11, Widowed: 3 });
}

function about(profile: Omit<Profile, "about">) {
  const [first, second] = profile.hobbies;
  const family = profile.familyType === "Joint" ? "Grew up in a joint family" : "Close to my parents";
  return `${profile.designation} at ${profile.company}, based in ${profile.city}. ${family}, and weekends usually mean ${first} or ${second}. Looking for someone kind, curious and easy to talk to.`;
}

function identity(random: Random, community: Community, gender: Gender, index: number) {
  const firstName = random.pick(gender === "Male" ? community.maleNames : community.femaleNames);
  const lastName = random.pick(community.surnames);
  const height = random.normal(gender === "Male" ? 174 : 160, gender === "Male" ? 6.5 : 5.5);
  return {
    id: `p${String(index).padStart(3, "0")}`,
    firstName,
    lastName,
    gender,
    country: "India",
    ...random.pick(community.places),
    heightCm: Math.round(height),
    email: `${firstName}.${lastName}${index}@example.com`.toLowerCase(),
    phone: `+91 9${String(Math.floor(random.next() * 1e9)).padStart(9, "0")}`,
  };
}

function family(random: Random, community: Community) {
  return {
    religion: community.religion,
    caste: random.pick(community.castes),
    motherTongue: community.motherTongue,
    languages: languages(community),
    brothers: Number(random.weighted({ "0": 40, "1": 45, "2": 15 })),
    sisters: Number(random.weighted({ "0": 45, "1": 45, "2": 10 })),
    fatherOccupation: random.pick(FATHER_JOBS),
    motherOccupation: random.pick(MOTHER_JOBS),
    ...horoscope(random, community),
  };
}

export function buildProfile(random: Random, gender: Gender, index: number): Profile {
  const community = pickCommunity(random);
  const { age, date } = birthDate(random, gender);
  const base = {
    ...identity(random, community, gender, index),
    dateOfBirth: date,
    ...career(random, pickProfession(random), age),
    maritalStatus: maritalStatus(random, age) as Profile["maritalStatus"],
    ...family(random, community),
    ...lifestyle(random, community, gender),
    hobbies: random.sample(HOBBIES, 3),
    verified: random.chance(0.9),
  };
  return { ...base, about: about(base) };
}

function lifestyle(random: Random, community: Community, gender: Gender) {
  return {
    wantKids: random.weighted({ Yes: 60, Maybe: 25, No: 15 }),
    // Women relocate after marriage far more often in Indian families.
    openToRelocate: random.weighted(gender === "Female" ? { Yes: 50, Maybe: 32, No: 18 } : { Yes: 33, Maybe: 35, No: 32 }),
    openToPets: random.weighted({ Yes: 35, Maybe: 35, No: 30 }),
    diet: pickDiet(random, community),
    drinking: random.weighted({ No: 62, Occasionally: 38 }),
    smoking: random.weighted({ No: 88, Occasionally: 12 }),
    familyType: random.weighted({ Nuclear: 68, Joint: 32 }),
    familyValues: random.weighted({ Traditional: 30, Moderate: 50, Liberal: 20 }),
  } as const;
}
