import Link from "next/link";

import { SignOutButton } from "./sign-out-button";

export function AppHeader({ name }: { name: string }) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="font-serif text-lg leading-none">
          TDC <span className="text-primary">Matchmaker</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-sm sm:inline">{name}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
