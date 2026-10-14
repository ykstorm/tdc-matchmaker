import type { Profile } from "@/types/profile";

export function formatHeight(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}" (${cm} cm)`;
}

export function formatIncome(lakhs: number) {
  return lakhs >= 100 ? `₹${(lakhs / 100).toFixed(1)} Cr a year` : `₹${lakhs} L a year`;
}

export function fullName(profile: Pick<Profile, "firstName" | "lastName">) {
  return `${profile.firstName} ${profile.lastName}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
