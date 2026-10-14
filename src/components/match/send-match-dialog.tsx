"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { ageFrom } from "@/lib/age";
import { formatHeight, formatIncome } from "@/lib/format";
import { introEmail } from "@/lib/intro-email";
import type { Match } from "@/types/match";
import type { Profile } from "@/types/profile";

interface Props {
  matchmaker: string;
  customer: Profile;
  match: Match | null;
  onClose: () => void;
  onSent: (matchId: string) => void;
}

function MatchSummary({ profile }: { profile: Profile }) {
  const facts = [
    `${ageFrom(profile.dateOfBirth)} years`, formatHeight(profile.heightCm), `${profile.city}, ${profile.state}`,
    `${profile.designation}, ${profile.company}`, formatIncome(profile.incomeLakhs), profile.degree,
    `${profile.religion}, ${profile.motherTongue}`, profile.diet, `Wants kids: ${profile.wantKids}`,
  ];
  return (
    <div className="bg-muted/60 rounded-lg px-4 py-3">
      <p className="font-medium">{profile.firstName} {profile.lastName}</p>
      <p className="text-muted-foreground mt-1 text-sm leading-normal">{facts.join(" · ")}</p>
    </div>
  );
}

export function SendMatchDialog({ matchmaker, customer, match, onClose, onSent }: Props) {
  return (
    <Dialog open={match !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {match && <SendForm key={match.profile.id} {...{ matchmaker, customer, match, onClose, onSent }} />}
      </DialogContent>
    </Dialog>
  );
}

function SendForm({ matchmaker, customer, match, onClose, onSent }: Props & { match: Match }) {
  const draft = introEmail(matchmaker, customer, match.profile);
  const [pending, setPending] = useState(false);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setPending(true);
    try {
      await api("/api/match/send", { method: "POST", body: { ...form, customerId: customer.id, matchId: match.profile.id } });
      toast.success(`Sent ${match.profile.firstName}'s profile to ${customer.firstName}. Mock email logged.`);
      onSent(match.profile.id);
      onClose();
    } catch (error) {
      toast.error(`Not sent. ${(error as Error).message}`, { duration: Infinity });
      setPending(false);
    }
  }

  return (
    <form onSubmit={send} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Send {match.profile.firstName} to {customer.firstName}</DialogTitle>
        <DialogDescription>Edit the email if you like. It goes to {customer.email}.</DialogDescription>
      </DialogHeader>
      <MatchSummary profile={match.profile} />
      <EmailFields subject={draft.subject} body={draft.body} />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Confirm send"}</Button>
      </DialogFooter>
    </form>
  );
}

function EmailFields({ subject, body }: { subject: string; body: string }) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" defaultValue={subject} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Email</Label>
        <Textarea id="body" name="body" defaultValue={body} required />
      </div>
    </>
  );
}
