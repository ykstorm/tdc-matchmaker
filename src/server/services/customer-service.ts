import { randomUUID } from "node:crypto";

import { ageFrom } from "@/lib/age";
import { fullName } from "@/lib/format";
import type { Customer, CustomerRecord, CustomerStatus, CustomerSummary } from "@/types/customer";
import { store } from "../data/store";
import { NotFoundError } from "../errors";
import type { Session } from "../token";

function profileOf(record: CustomerRecord) {
  const profile = store.profileById(record.profileId);
  if (!profile) throw new NotFoundError(`Profile ${record.profileId} is missing from the pool`);
  return profile;
}

// Matchmakers only ever see their own customers. Asking for someone else's
// customer is answered the same way as asking for one that does not exist.
export function findRecord(session: Session, customerId: string) {
  const record = store.customers.find(
    (c) => c.profileId === customerId && c.matchmakerId === session.matchmakerId,
  );
  if (!record) throw new NotFoundError("Customer not found");
  return record;
}

export function listCustomers(session: Session): CustomerSummary[] {
  return store.customers
    .filter((record) => record.matchmakerId === session.matchmakerId)
    .map((record) => {
      const profile = profileOf(record);
      return {
        id: profile.id,
        name: fullName(profile),
        gender: profile.gender,
        age: ageFrom(profile.dateOfBirth),
        city: profile.city,
        maritalStatus: profile.maritalStatus,
        status: record.status,
        sentCount: record.sentMatchIds.length,
      };
    });
}

export function getCustomer(session: Session, customerId: string): Customer {
  const record = findRecord(session, customerId);
  return { ...record, profile: profileOf(record) };
}

export function addNote(session: Session, customerId: string, text: string) {
  const record = findRecord(session, customerId);
  const note = { id: randomUUID(), text, author: session.name, createdAt: new Date().toISOString() };
  record.notes.unshift(note);
  return note;
}

export function setStatus(session: Session, customerId: string, status: CustomerStatus) {
  const record = findRecord(session, customerId);
  record.status = status;
  return { status };
}
