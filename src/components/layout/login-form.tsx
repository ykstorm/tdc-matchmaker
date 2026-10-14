"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: Object.fromEntries(form) });
      router.replace("/dashboard");
    } catch (failure) {
      setError((failure as Error).message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={signIn} className="mt-8 grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" autoComplete="username" required aria-invalid={!!error} aria-describedby="login-error" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required aria-invalid={!!error} aria-describedby="login-error" />
      </div>
      <p id="login-error" role="status" className="text-destructive min-h-5 text-sm">
        {error}
      </p>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
