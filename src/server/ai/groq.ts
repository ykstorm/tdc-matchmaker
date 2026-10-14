import OpenAI from "openai";

import { ageFrom } from "@/lib/age";
import type { Profile } from "@/types/profile";

// Groq speaks the OpenAI API, so the official SDK works with Groq's base URL.
// gpt-oss-20b is an open-weight model Groq serves on its free tier. No OpenAI
// account or key is involved. GROQ_MODEL swaps it without a code change.
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

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

// gpt-oss thinks before answering. Low effort is plenty for ranking 20
// people, and the reasoning stays out of the reply so JSON.parse sees only
// the answer. Groq's default cap of 1024 tokens cuts off 20 explanations.
const REASONING = MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low", include_reasoning: false } : {};

export async function askForJson(system: string, user: unknown) {
  const ai = groq();
  if (!ai) return null;
  const completion = await ai.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    max_completion_tokens: 4096,
    response_format: { type: "json_object" },
    ...(REASONING as object),
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(user) },
    ],
  });
  return JSON.parse(completion.choices[0]?.message.content ?? "null") as unknown;
}
