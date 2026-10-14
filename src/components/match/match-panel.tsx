"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Match, MatchList } from "@/types/match";
import type { Profile } from "@/types/profile";
import { MatchCard } from "./match-card";
import { SendMatchDialog } from "./send-match-dialog";

interface Props {
  matchmaker: string;
  customer: Profile;
  sentMatchIds: string[];
}

type Load = { state: "loading" } | { state: "failed"; message: string } | { state: "ready"; list: MatchList };

function useMatches(customerId: string) {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    api<MatchList>(`/api/customers/${customerId}/matches`)
      .then((list) => setLoad({ state: "ready", list }))
      .catch((error: Error) => setLoad({ state: "failed", message: error.message }));
  }, [customerId, attempt]);
  const retry = () => {
    setLoad({ state: "loading" });
    setAttempt((n) => n + 1);
  };
  return { load, retry };
}

export function MatchPanel({ matchmaker, customer, sentMatchIds }: Props) {
  const { load, retry } = useMatches(customer.id);
  const [sent, setSent] = useState(sentMatchIds);
  const [sending, setSending] = useState<Match | null>(null);

  return (
    <section aria-labelledby="matches-heading" aria-busy={load.state === "loading"}>
      <h2 id="matches-heading" className="font-serif text-2xl leading-tight">Suggested matches</h2>
      {load.state === "loading" && <MatchSkeleton />}
      <p role="status" className="sr-only">{announcement(load)}</p>
      {load.state === "failed" && (
        <div className="mt-4 grid justify-items-start gap-3 text-sm">
          <p>Matches did not load. {load.message}</p>
          <Button variant="outline" size="sm" onClick={retry}>Try again</Button>
        </div>
      )}
      {load.state === "ready" && <PoolSummary list={load.list} />}
      {load.state === "ready" && (
        <ul className="mt-4 grid gap-3">
          {load.list.matches.map((match) => (
            <MatchCard key={match.profile.id} match={match} sent={sent.includes(match.profile.id)} onSend={setSending} />
          ))}
        </ul>
      )}
      <SendMatchDialog
        matchmaker={matchmaker}
        customer={customer}
        match={sending}
        onClose={() => setSending(null)}
        onSent={(id) => setSent((current) => [...current, id])}
      />
    </section>
  );
}

function PoolSummary({ list }: { list: MatchList }) {
  return (
    <p className="text-muted-foreground mt-1 text-sm leading-normal">
      <span className="tabular-nums">{list.passedFilters}</span> of <span className="tabular-nums">{list.poolSize}</span> profiles
      pass the dealbreakers. Showing the top <span className="tabular-nums">{list.matches.length}</span>.
      {list.relaxed.map((note) => ` ${note}.`)}
      {list.matches.length === 0 && " Nobody fits yet. Loosen a partner preference with the customer, then check back."}
    </p>
  );
}

function MatchSkeleton() {
  return (
    <div className="mt-4 grid gap-3">
      <p className="text-muted-foreground text-sm">Ranking matches. The AI review takes a few seconds.</p>
      {[0, 1, 2].map((key) => (
        <div key={key} aria-hidden="true" className="bg-muted h-28 rounded-xl motion-safe:animate-pulse" />
      ))}
    </div>
  );
}

// Rendered from the start so screen readers announce each change.
function announcement(load: Load) {
  if (load.state === "loading") return "Ranking matches";
  if (load.state === "failed") return "Matches did not load";
  return `${load.list.matches.length} matches ready`;
}
