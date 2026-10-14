import { LoginForm } from "@/components/layout/login-form";

export default function LoginPage() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="text-primary text-xs font-semibold tracking-[0.05em] uppercase">The Date Crew</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.01em]">Matchmaker sign in</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-normal">
          Your customers, their profiles and today&apos;s matches.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
