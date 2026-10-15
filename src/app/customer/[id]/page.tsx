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
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-5">
        <div className="grid min-w-0 content-start gap-8 lg:col-span-3">
          <div>
            <Link href="/dashboard" className="text-muted-foreground inline-block py-1 text-sm hover:underline">All customers</Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl leading-tight tracking-heading">{fullName(profile)}</h1>
                {profile.verified && <Badge variant="secondary">Verified</Badge>}
              </div>
              <StatusSelect customerId={profile.id} initial={customer.status} />
            </div>
          </div>
          <Biodata profile={profile} preferences={customer.preferences} />
          <NotesPanel customerId={profile.id} initial={customer.notes} />
        </div>
        {/* On wide screens the matches scroll on their own, so you can move
            through all 20 while the biodata stays where it is. */}
        <div className="min-w-0 lg:sticky lg:top-0 lg:col-span-2 lg:max-h-screen lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:py-2 lg:pr-2">
          <MatchPanel matchmaker={session.name} customer={profile} sentMatchIds={customer.sentMatchIds} />
        </div>
      </main>
    </>
  );
}
