import type { NearMiss } from "@/types/match";

// Who missed out on one rule only. It tells the matchmaker which preference
// is worth talking through with the customer.
export function NearMisses({ nearMisses }: { nearMisses: NearMiss[] }) {
  if (nearMisses.length === 0) return null;
  return (
    <div className="bg-muted mt-4 rounded-lg px-4 py-3 text-sm leading-normal">
      <p className="font-medium">Almost made it</p>
      <ul className="text-muted-foreground mt-1 grid gap-0.5">
        {nearMisses.map((miss) => (
          <li key={miss.rule}>
            <span className="text-foreground tabular-nums">{miss.count}</span>{" "}
            {miss.count === 1 ? "person fits" : "people fit"} everything except {miss.rule}.
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-2 text-xs">Worth raising with the customer if they want more options.</p>
    </div>
  );
}
