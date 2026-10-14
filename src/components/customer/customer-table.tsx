"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CustomerSummary } from "@/types/customer";
import { StatusBadge } from "./status-badge";

export function CustomerTable({ customers }: { customers: CustomerSummary[] }) {
  const router = useRouter();

  return (
    <div className="bg-card mt-6 rounded-xl border px-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Marital status</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            // The name is a real link for keyboard and new-tab use. The row
            // click is a mouse shortcut on top of it.
            <TableRow key={customer.id} clickable onClick={() => router.push(`/customer/${customer.id}`)}>
              <TableCell>
                <Link href={`/customer/${customer.id}`} onClick={(event) => event.stopPropagation()} className="font-medium hover:underline">
                  {customer.name}
                </Link>
                <span className="text-muted-foreground ml-2 text-xs">{customer.gender}</span>
              </TableCell>
              <TableCell>
                <span className="tabular-nums">{customer.age}</span>
              </TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.maritalStatus}</TableCell>
              <TableCell>
                <StatusBadge status={customer.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
