import { describe, expect, it } from "vitest";

import { ageFactor, heightFactor } from "@/server/matching/factors/physical";
import { careerFactor, incomeFactor } from "@/server/matching/factors/money";
import { relocationFactor } from "@/server/matching/factors/place";
import { dietFactor, horoscopeFactor, kidsFactor } from "@/server/matching/factors/values";
import { OPEN_PREFS, makeProfile } from "./fixtures";

const man = (overrides = {}, age = 30) => ({ profile: makeProfile({ gender: "Male", ...overrides }), age });
const woman = (overrides = {}, age = 27) => ({ profile: makeProfile({ gender: "Female", ...overrides }), age });

describe("age", () => {
  it("gives a man full marks for a partner one to four years younger", () => {
    expect(ageFactor(man({}, 30), woman({}, 27))?.score).toBe(1);
  });

  it("marks a man down when the woman is older", () => {
    expect(ageFactor(man({}, 30), woman({}, 32))?.score).toBeLessThan(0.5);
  });

  it("gives a woman full marks for a partner the same age or a little older", () => {
    expect(ageFactor(woman({}, 27), man({}, 27))?.score).toBe(1);
    expect(ageFactor(woman({}, 27), man({}, 31))?.score).toBe(1);
  });
});

describe("height and income from the man's side", () => {
  it("prefers a partner 8 to 20 cm shorter", () => {
    expect(heightFactor(man({ heightCm: 178 }), woman({ heightCm: 162 }))?.score).toBe(1);
    expect(heightFactor(man({ heightCm: 170 }), woman({ heightCm: 172 }))?.score).toBeLessThan(0.5);
  });

  it("prefers a partner who earns somewhat less", () => {
    expect(incomeFactor(man({ incomeLakhs: 30 }), woman({ incomeLakhs: 20 }))?.score).toBe(1);
    expect(incomeFactor(man({ incomeLakhs: 30 }), woman({ incomeLakhs: 45 }))?.score).toBeLessThan(0.5);
  });
});

describe("career from the woman's side", () => {
  it("does not penalise a partner who earns more", () => {
    const higher = careerFactor(woman({ incomeLakhs: 20 }), man({ incomeLakhs: 60 }))!.score;
    const equal = careerFactor(woman({ incomeLakhs: 20 }), man({ incomeLakhs: 20 }))!.score;
    expect(higher).toBe(equal);
  });

  it("scores a partner who earns much less lower", () => {
    const less = careerFactor(woman({ incomeLakhs: 40 }), man({ incomeLakhs: 15 }))!.score;
    expect(less).toBeLessThan(0.6);
  });
});

describe("values", () => {
  it("treats yes against no on kids as a clash and maybe as half", () => {
    expect(kidsFactor(man({ wantKids: "Yes" }), woman({ wantKids: "No" }))?.score).toBe(0);
    expect(kidsFactor(man({ wantKids: "Yes" }), woman({ wantKids: "Maybe" }))?.score).toBe(0.5);
  });

  it("keeps vegetarian diets close together", () => {
    expect(dietFactor(man({ diet: "Jain" }), woman({ diet: "Vegetarian" }))?.score).toBe(0.8);
    expect(dietFactor(man({ diet: "Vegetarian" }), woman({ diet: "Non-vegetarian" }))?.score).toBe(0.2);
  });

  it("skips horoscope unless the customer asked for it", () => {
    expect(horoscopeFactor({ ...man(), preferences: OPEN_PREFS }, woman())).toBeNull();
    const asked = { ...man({ manglik: "Yes" }), preferences: { ...OPEN_PREFS, horoscopeMatters: true } };
    expect(horoscopeFactor(asked, woman({ manglik: "No" }))?.score).toBe(0);
  });
});

describe("relocation", () => {
  it("does not matter when they live in the same city", () => {
    expect(relocationFactor(woman({ openToRelocate: "No" }), man({ openToRelocate: "No" }))?.score).toBe(1);
  });

  it("is zero when they live apart and nobody will move", () => {
    const apart = man({ city: "Delhi", openToRelocate: "No" });
    expect(relocationFactor(woman({ openToRelocate: "No" }), apart)?.score).toBe(0);
  });
});
