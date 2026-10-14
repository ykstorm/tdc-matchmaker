import { LoginForm } from "@/components/layout/login-form";
import { Rangoli } from "@/components/layout/rangoli";

export default function LoginPage() {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <div className="bg-secondary hidden flex-col items-center justify-center gap-8 px-8 lg:flex">
        <Rangoli />
        <p className="text-secondary-foreground max-w-xs text-center font-serif text-lg leading-snug">
          Every good match starts with someone who listened first.
        </p>
      </div>
      <div className="grid place-items-center px-4 py-16">
        <div className="w-full max-w-sm">
          <p className="text-primary tracking-label text-xs font-semibold uppercase">The Date Crew</p>
          <h1 className="tracking-heading mt-2 font-serif text-3xl leading-tight">Matchmaker sign in</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-normal">
            Your customers, their profiles and today&apos;s matches.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
