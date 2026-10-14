export function PageSkeleton({ label }: { label: string }) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6" aria-busy="true">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div aria-hidden="true" className="mt-6 grid gap-3">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="bg-muted h-12 rounded-lg motion-safe:animate-pulse" />
        ))}
      </div>
    </main>
  );
}
