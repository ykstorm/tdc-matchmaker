import { CustomerTable } from "@/components/customer/customer-table";
import { AppHeader } from "@/components/layout/app-header";
import { requireSession } from "@/server/session";
import { listCustomers } from "@/server/services/customer-service";

export default async function DashboardPage() {
  const session = await requireSession();
  const customers = listCustomers(session);

  return (
    <>
      <AppHeader name={session.name} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl leading-tight tracking-heading">Your customers</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <span className="tabular-nums">{customers.length}</span> people you are finding a match for. Open one to see their profile and matches.
        </p>
        <CustomerTable customers={customers} />
      </main>
    </>
  );
}
