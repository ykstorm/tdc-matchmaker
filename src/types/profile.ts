export type Gender = "Male" | "Female";
export type YesNoMaybe = "Yes" | "No" | "Maybe";
export type MaritalStatus = "Never Married" | "Divorced" | "Widowed";
export type Diet = "Vegetarian" | "Eggetarian" | "Non-vegetarian" | "Vegan" | "Jain";
export type EducationLevel = "Bachelors" | "Masters" | "Doctorate";
export type FamilyType = "Nuclear" | "Joint";
export type FamilyValues = "Traditional" | "Moderate" | "Liberal";
export type Habit = "No" | "Occasionally";
export type Manglik = "Yes" | "No" | "Partial";

export type Profession =
  | "Technology"
  | "Finance"
  | "Medicine"
  | "Law"
  | "Design"
  | "Education"
  | "Business"
  | "Government"
  | "Consulting";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  heightCm: number;
  email: string;
  phone: string;
  college: string;
  degree: string;
  educationLevel: EducationLevel;
  profession: Profession;
  incomeLakhs: number;
  company: string;
  designation: string;
  maritalStatus: MaritalStatus;
  languages: string[];
  motherTongue: string;
  brothers: number;
  sisters: number;
  religion: string;
  caste: string;
  gotra: string;
  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;
  diet: Diet;
  drinking: Habit;
  smoking: Habit;
  familyType: FamilyType;
  familyValues: FamilyValues;
  fatherOccupation: string;
  motherOccupation: string;
  manglik: Manglik;
  rashi: string;
  hobbies: string[];
  about: string;
  verified: boolean;
}
