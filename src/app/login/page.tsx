import { DemoAccounts } from "@/components/layout/demo-accounts";
import { LoginForm } from "@/components/layout/login-form";
import { Rangoli } from "@/components/layout/rangoli";

export default function LoginPage() {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <div className="bg-secondary hidden overflow-hidden lg:block">
        <Rangoli />
      </div>
      <div className="grid place-items-center px-4 py-16">
        <div className="w-full max-w-sm">
          <p className="text-primary tracking-label text-xs font-semibold uppercase">The Date Crew</p>
          <h1 className="tracking-heading mt-2 font-serif text-3xl leading-tight">Matchmaker sign in</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-normal">
            Your customers, their profiles and today&apos;s matches.
          </p>
          <LoginForm />
          <DemoAccounts />
        </div>
      </div>
    </main>
  );
}
