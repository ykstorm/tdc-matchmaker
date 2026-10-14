import type { MatchList } from "@/types/match";
import type { Profile } from "@/types/profile";
import { rerankWithAi } from "../ai/rerank";
import { store } from "../data/store";
import { NotFoundError } from "../errors";
import { rankMatches } from "../matching/rank";
import type { Session } from "../token";
import { findRecord, getCustomer } from "./customer-service";

// AI reviews are slow and cost money, and the same shortlist gets the same
// answer, so keep them per instance keyed by customer and shortlist.
const reviewed = new Map<string, MatchList["matches"]>();

async function withAiReview(customer: Profile, list: MatchList): Promise<MatchList> {
  const key = `${customer.id}:${list.matches.map((m) => m.profile.id).join(",")}`;
  const cached = reviewed.get(key);
  if (cached) return { ...list, matches: cached };
  try {
    const matches = await rerankWithAi(customer, list.matches);
    if (!matches) return list;
    reviewed.set(key, matches);
    return { ...list, matches };
  } catch (error) {
    console.error("AI review failed, showing rule-based ranking", error);
    return list;
  }
}

export async function getMatches(session: Session, customerId: string) {
  const customer = getCustomer(session, customerId);
  const list = rankMatches(customer.profile, customer.preferences, store.profiles);
  return withAiReview(customer.profile, list);
}

async function findMatch(session: Session, customerId: string, matchId: string) {
  const { matches } = await getMatches(session, customerId);
  const match = matches.find((m) => m.profile.id === matchId);
  if (!match) throw new NotFoundError("That profile is not in this customer's matches");
  return match;
}

export async function sendMatch(
  session: Session,
  customerId: string,
  matchId: string,
  email: { subject: string; body: string },
) {
  const customer = getCustomer(session, customerId);
  const match = await findMatch(session, customerId, matchId);
  const sent = {
    to: customer.profile.email,
    ...email,
    customerId,
    matchId,
    sentBy: session.name,
    sentAt: new Date().toISOString(),
  };
  // Mock email: logged and kept in the outbox instead of going to a mail API.
  console.info(`[mock email] to=${sent.to} subject="${sent.subject}"`);
  store.outbox.push(sent);
  const record = findRecord(session, customerId);
  if (!record.sentMatchIds.includes(matchId)) record.sentMatchIds.push(matchId);
  if (record.status === "New" || record.status === "Matching") record.status = "Introduced";
  return { sentTo: sent.to, matchName: match.profile.firstName, status: record.status };
}
