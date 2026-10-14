import { ageFrom } from "@/lib/age";
import { formatDate, formatHeight, formatIncome } from "@/lib/format";
import type { PartnerPreferences } from "@/types/customer";
import type { Profile } from "@/types/profile";

type Field = [label: string, value: string | number];

const yesNo = (value: boolean) => (value ? "Yes" : "No");

// Same order and grouping as a printed Indian biodata and the big matrimony
// sites, so a matchmaker finds each field where they expect it.
function sections(p: Profile, prefs: PartnerPreferences): [string, Field[]][] {
  return [
    ["Personal", [
      ["Date of birth", `${formatDate(p.dateOfBirth)} (${ageFrom(p.dateOfBirth)})`],
      ["Gender", p.gender], ["Height", formatHeight(p.heightCm)], ["Marital status", p.maritalStatus],
      ["Lives in", `${p.city}, ${p.state}, ${p.country}`], ["Mother tongue", p.motherTongue],
      ["Languages", p.languages.join(", ")], ["Email", p.email], ["Phone", p.phone],
    ]],
    ["Education and career", [
      ["Degree", p.degree], ["College", p.college], ["Works as", `${p.designation}, ${p.company}`],
      ["Field", p.profession], ["Income", formatIncome(p.incomeLakhs)],
    ]],
    ["Family and background", [
      ["Religion", p.religion], ["Caste", p.caste], ["Gotra", p.gotra], ["Manglik", p.manglik], ["Rashi", p.rashi],
      ["Family", `${p.familyType}, ${p.familyValues.toLowerCase()} values`], ["Father", p.fatherOccupation],
      ["Mother", p.motherOccupation], ["Brothers", p.brothers], ["Sisters", p.sisters],
    ]],
    ["Lifestyle", [
      ["Diet", p.diet], ["Drinks", p.drinking], ["Smokes", p.smoking], ["Wants kids", p.wantKids],
      ["Open to relocate", p.openToRelocate], ["Open to pets", p.openToPets], ["Hobbies", p.hobbies.join(", ")],
    ]],
    ["Partner preferences", [
      ["Age", `${prefs.ageMin} to ${prefs.ageMax}`], ["Same religion only", yesNo(prefs.sameReligionOnly)],
      ["Open to divorced", yesNo(prefs.openToDivorced)], ["Vegetarian only", yesNo(prefs.vegetarianOnly)],
      ["Horoscope matters", yesNo(prefs.horoscopeMatters)],
    ]],
  ];
}

export function Biodata({ profile, preferences }: { profile: Profile; preferences: PartnerPreferences }) {
  return (
    <div className="grid gap-8">
      <p className="max-w-prose text-base leading-relaxed">{profile.about}</p>
      {sections(profile, preferences).map(([title, fields]) => (
        <section key={title} aria-labelledby={`section-${title}`}>
          <h2 id={`section-${title}`} className="text-muted-foreground text-xs font-semibold tracking-label uppercase">
            {title}
          </h2>
          <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-muted-foreground text-xs">{label}</dt>
                <dd className="mt-0.5 text-sm break-words tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
