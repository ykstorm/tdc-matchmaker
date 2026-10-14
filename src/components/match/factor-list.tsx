import type { FactorScore } from "@/types/match";

// The rule-based breakdown behind the score, so a matchmaker can check the AI
// note against the numbers it started from.
export function FactorList({ factors }: { factors: FactorScore[] }) {
  return (
    <ul className="grid gap-2" aria-label="Score breakdown">
      {factors.map((factor) => (
        <li key={factor.key} className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground w-28 shrink-0">
            {factor.label} <span className="tabular-nums">({factor.weight}%)</span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="bg-muted h-1.5 rounded-full" aria-hidden="true">
              <div className="bg-primary/70 h-full rounded-full" style={{ width: `${Math.round(factor.score * 100)}%` }} />
            </div>
            <p className="mt-1 truncate" title={factor.detail}>{factor.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
