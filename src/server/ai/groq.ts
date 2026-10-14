import OpenAI from "openai";

import { ageFrom } from "@/lib/age";
import type { Profile } from "@/types/profile";

// Groq speaks the OpenAI API, so the official SDK works with a different base
// URL. Free tier, no card. Groq lists this model as deprecated for
// 16 Aug 2026 while still serving it, so GROQ_MODEL can swap it without a
// deploy (their suggested replacement is openai/gpt-oss-20b).
const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

let client: OpenAI | null | undefined;

// Null when no key is set. Callers then use the rule-based text, so the app
// works the same without AI, just with plainer explanations.
function groq() {
  if (client === undefined) {
    const apiKey = process.env.GROQ_API_KEY;
    client = apiKey
      ? new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1", timeout: 20_000, maxRetries: 1 })
      : null;
  }
  return client;
}

// What the model sees about a person. No surname, email or phone: the model
// does not need them to judge fit, so they never leave our server.
export function profileBrief(profile: Profile) {
  return {
    id: profile.id,
    firstName: profile.firstName,
    age: ageFrom(profile.dateOfBirth),
    city: profile.city,
    work: `${profile.designation}, ${profile.profession}, ₹${profile.incomeLakhs} L`,
    education: profile.degree,
    maritalStatus: profile.maritalStatus,
    religion: profile.religion,
    motherTongue: profile.motherTongue,
    diet: profile.diet,
    wantKids: profile.wantKids,
    openToRelocate: profile.openToRelocate,
    openToPets: profile.openToPets,
    family: `${profile.familyValues} values, ${profile.familyType} family`,
    habits: `drinks ${profile.drinking}, smokes ${profile.smoking}`,
    hobbies: profile.hobbies,
    about: profile.about,
  };
}

export async function askForJson(system: string, user: unknown) {
  const ai = groq();
  if (!ai) return null;
  const completion = await ai.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(user) },
    ],
  });
  return JSON.parse(completion.choices[0]?.message.content ?? "null") as unknown;
}
