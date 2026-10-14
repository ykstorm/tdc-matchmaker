import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/types/customer";

const VARIANT = {
  New: "new",
  Matching: "matching",
  Introduced: "introduced",
  "On Hold": "hold",
} as const satisfies Record<CustomerStatus, string>;

// The label is always shown, so status never relies on color alone.
export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>;
}
