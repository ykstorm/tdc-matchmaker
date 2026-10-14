import type { Profile } from "./profile";

export const CUSTOMER_STATUSES = ["New", "Matching", "Introduced", "On Hold"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  sameReligionOnly: boolean;
  openToDivorced: boolean;
  vegetarianOnly: boolean;
  horoscopeMatters: boolean;
}

export interface Note {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface CustomerRecord {
  profileId: string;
  matchmakerId: string;
  status: CustomerStatus;
  joinedAt: string;
  preferences: PartnerPreferences;
  notes: Note[];
  sentMatchIds: string[];
}

export interface Customer extends CustomerRecord {
  profile: Profile;
}

export interface CustomerSummary {
  id: string;
  name: string;
  gender: Profile["gender"];
  age: number;
  city: string;
  maritalStatus: Profile["maritalStatus"];
  status: CustomerStatus;
  sentCount: number;
}
