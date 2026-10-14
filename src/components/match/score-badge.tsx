import { cn } from "@/lib/cn";
import type { MatchTier } from "@/types/match";

export function ScoreBadge({ score, tier }: { score: number; tier: MatchTier }) {
  const high = tier === "High Potential";
  return (
    <div className={cn("shrink-0 rounded-lg px-3 py-1.5 text-right", high ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
      <p className="font-serif text-2xl leading-none tabular-nums">{score}</p>
      <p className="mt-1 text-xs leading-none font-medium whitespace-nowrap">{tier}</p>
    </div>
  );
}
