"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { CUSTOMER_STATUSES, type CustomerStatus } from "@/types/customer";

export function StatusSelect({ customerId, initial }: { customerId: string; initial: CustomerStatus }) {
  const [status, setStatus] = useState(initial);

  async function change(next: CustomerStatus) {
    const previous = status;
    setStatus(next);
    try {
      await api(`/api/customers/${customerId}`, { method: "PATCH", body: { status: next } });
    } catch (error) {
      setStatus(previous);
      toast.error(`Status not saved. ${(error as Error).message}`, { duration: Infinity });
    }
  }

  return (
    <Select value={status} onValueChange={(value) => change(value as CustomerStatus)}>
      <SelectTrigger aria-label="Journey status" className="min-w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CUSTOMER_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
