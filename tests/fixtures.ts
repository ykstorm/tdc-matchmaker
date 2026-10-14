import type { PartnerPreferences } from "@/types/customer";
import type { Profile } from "@/types/profile";

export const TODAY = new Date("2026-10-14");

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "p1",
    firstName: "Test",
    lastName: "Person",
    gender: "Male",
    dateOfBirth: "1996-01-01",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    heightCm: 175,
    email: "test@example.com",
    phone: "+91 9000000000",
    college: "IIT Bombay",
    degree: "B.Tech",
    educationLevel: "Bachelors",
    profession: "Technology",
    incomeLakhs: 30,
    company: "Zoho",
    designation: "Software Engineer",
    maritalStatus: "Never Married",
    languages: ["Marathi", "English"],
    motherTongue: "Marathi",
    brothers: 1,
    sisters: 0,
    religion: "Hindu",
    caste: "Maratha",
    gotra: "Kashyap",
    wantKids: "Yes",
    openToRelocate: "Maybe",
    openToPets: "Yes",
    diet: "Vegetarian",
    drinking: "No",
    smoking: "No",
    familyType: "Nuclear",
    familyValues: "Moderate",
    fatherOccupation: "Engineer",
    motherOccupation: "Homemaker",
    manglik: "No",
    rashi: "Mesh",
    hobbies: ["reading"],
    about: "",
    verified: true,
    ...overrides,
  };
}

export const OPEN_PREFS: PartnerPreferences = {
  ageMin: 18,
  ageMax: 60,
  sameReligionOnly: false,
  openToDivorced: true,
  vegetarianOnly: false,
  horoscopeMatters: false,
};
