import { ageFrom } from "@/lib/age";
import type { Profile } from "@/types/profile";

function sharedThing(customer: Profile, match: Profile) {
  const hobby = customer.hobbies.find((h) => match.hobbies.includes(h));
  if (hobby) return `you both love ${hobby}`;
  if (customer.city === match.city) return `you are both in ${match.city}`;
  if (customer.motherTongue === match.motherTongue) return `you both speak ${match.motherTongue} at home`;
  return "your families want the same things";
}

// The draft the matchmaker edits in the Send Match dialog before sending.
export function introEmail(matchmaker: string, customer: Profile, match: Profile) {
  const body = [
    `Hi ${customer.firstName},`,
    "",
    `I'd like you to meet ${match.firstName}, ${ageFrom(match.dateOfBirth)}, ${match.designation} at ${match.company} in ${match.city}. ` +
      `I thought of you because ${sharedThing(customer, match)}. ` +
      "Have a look at the profile and tell me if you'd like me to set up a first call.",
    "",
    matchmaker.split(" ")[0],
  ].join("\n");
  return { subject: `Someone I'd like you to meet: ${match.firstName}`, body };
}
