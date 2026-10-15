import { describe, expect, it } from "vitest";

import { rankMatches } from "@/server/matching/rank";
import { mutualScore } from "@/server/matching/score";
import { OPEN_PREFS, TODAY, makeProfile } from "./fixtures";

const customer = makeProfile({ id: "c1", gender: "Male", dateOfBirth: "1995-05-01" });

function woman(id: string, overrides = {}) {
  return makeProfile({ id, gender: "Female", dateOfBirth: "1998-05-01", heightCm: 162, incomeLakhs: 20, ...overrides });
}

describe("rankMatches", () => {
  it("never shows someone who breaks a dealbreaker", () => {
    const pool = [
      woman("ok"),
      woman("divorced", { maritalStatus: "Divorced" }),
      woman("other-faith", { religion: "Christian" }),
      woman("unverified", { verified: false }),
      makeProfile({ id: "same-gender", gender: "Male" }),
    ];
    const prefs = { ...OPEN_PREFS, sameReligionOnly: true, openToDivorced: false };
    const ids = rankMatches(customer, prefs, pool, TODAY).matches.map((m) => m.profile.id);
    expect(ids).toEqual(["ok"]);
  });

  it("ranks a clash on kids below an otherwise identical match", () => {
    const pool = [woman("clash", { wantKids: "No" }), woman("aligned")];
    const ids = rankMatches(customer, OPEN_PREFS, pool, TODAY).matches.map((m) => m.profile.id);
    expect(ids).toEqual(["aligned", "clash"]);
  });

  it("widens the age range and says so when too few people fit", () => {
    const prefs = { ...OPEN_PREFS, ageMin: 29, ageMax: 30 };
    const result = rankMatches(customer, prefs, [woman("a")], TODAY);
    expect(result.relaxed.length).toBeGreaterThan(0);
  });

  it("explains every match without the AI", () => {
    const [match] = rankMatches(customer, OPEN_PREFS, [woman("a")], TODAY).matches;
    expect(match.explanation).toMatch(/^Strong on|^No standout/);
    expect(match.explainedBy).toBe("rules");
  });
});

describe("near misses", () => {
  it("counts people who fail exactly one of the customer's own rules", () => {
    const pool = [
      woman("ok"),
      woman("other-faith-1", { religion: "Christian" }),
      woman("other-faith-2", { religion: "Sikh" }),
      woman("divorced", { maritalStatus: "Divorced" }),
      woman("two-misses", { religion: "Jain", maritalStatus: "Divorced" }),
      woman("unverified", { verified: false, religion: "Muslim" }),
    ];
    const prefs = { ...OPEN_PREFS, sameReligionOnly: true, openToDivorced: false };
    const { nearMisses } = rankMatches(customer, prefs, pool, TODAY);
    expect(nearMisses).toEqual([
      { rule: "the same-religion rule", count: 2 },
      { rule: "the never-married rule", count: 1 },
    ]);
  });
});

describe("mutualScore", () => {
  it("lets a one-sided match sink below a balanced one with the same average", () => {
    expect(mutualScore(0.95, 0.35)).toBeLessThan(mutualScore(0.65, 0.65));
  });
});
