import Link from "next/link";
import { notFound } from "next/navigation";

import { Biodata } from "@/components/customer/biodata";
import { NotesPanel } from "@/components/customer/notes-panel";
import { StatusSelect } from "@/components/customer/status-select";
import { AppHeader } from "@/components/layout/app-header";
import { MatchPanel } from "@/components/match/match-panel";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/format";
import { NotFoundError } from "@/server/errors";
import { requireSession } from "@/server/session";
import { getCustomer } from "@/server/services/customer-service";

async function loadCustomer(id: string) {
  const session = await requireSession();
  try {
    return { session, customer: getCustomer(session, id) };
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

export default async function CustomerPage({ params }: PageProps<"/customer/[id]">) {
  const { session, customer } = await loadCustomer((await params).id);
  const { profile } = customer;

  return (
    <>
      <AppHeader name={session.name} />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid content-start gap-8">
          <div>
            <Link href="/dashboard" className="text-muted-foreground inline-block py-1 text-sm hover:underline">All customers</Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl leading-tight tracking-[-0.01em]">{fullName(profile)}</h1>
                {profile.verified && <Badge variant="secondary">Verified</Badge>}
              </div>
              <StatusSelect customerId={profile.id} initial={customer.status} />
            </div>
          </div>
          <Biodata profile={profile} preferences={customer.preferences} />
          <NotesPanel customerId={profile.id} initial={customer.notes} />
        </div>
        <MatchPanel matchmaker={session.name} customer={profile} sentMatchIds={customer.sentMatchIds} />
      </main>
    </>
  );
}
