"use client";

import { ChevronDownIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ageFrom } from "@/lib/age";
import type { Match } from "@/types/match";
import { FactorList } from "./factor-list";
import { ScoreBadge } from "./score-badge";

interface Props {
  match: Match;
  sent: boolean;
  onSend: (match: Match) => void;
}

export function MatchCard({ match, sent, onSend }: Props) {
  const { profile } = match;
  return (
    <li className="bg-card rounded-xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-tight">{profile.firstName} {profile.lastName}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            <span className="tabular-nums">{ageFrom(profile.dateOfBirth)}</span>, {profile.city}, {profile.designation}
          </p>
        </div>
        <ScoreBadge score={match.score} tier={match.tier} />
      </div>
      <WhyThisMatch match={match} />
      <div className="mt-4 flex items-center justify-end gap-3">
        {sent && <Badge variant="introduced">Sent</Badge>}
        <Button size="sm" variant={sent ? "outline" : "secondary"} onClick={() => onSend(match)}>
          {sent ? "Send again" : "Send match"}
        </Button>
      </div>
    </li>
  );
}

function WhyThisMatch({ match }: { match: Match }) {
  return (
    <Collapsible>
      <div className="mt-3">
        <CollapsibleTrigger asChild>
          <Button variant="link" size="inline">
            Why this match?
            <ChevronDownIcon className="transition-transform duration-150 in-data-[state=open]:rotate-180" aria-hidden="true" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="mt-3 grid gap-4">
          <p className="max-w-prose text-sm leading-relaxed">{match.explanation}</p>
          <p className="text-muted-foreground text-xs">
            {match.explainedBy === "ai" ? "Note and final score by Groq, within 8 points of the rule score." : "Note from the rule-based score. AI review is off."}{" "}
            Fit from your customer&apos;s side: <span className="tabular-nums">{match.customerSide}</span>. From {match.profile.firstName}&apos;s side:{" "}
            <span className="tabular-nums">{match.candidateSide}</span>.
          </p>
          <FactorList factors={match.factors} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
