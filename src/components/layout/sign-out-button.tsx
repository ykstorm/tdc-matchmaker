"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await api("/api/auth/logout", { method: "POST", body: {} });
    router.replace("/login");
  }

  return (
    <Button variant="ghost" size="sm" onClick={signOut}>
      Sign out
    </Button>
  );
}
