import PublicRoute from "@/provider/PublicRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/10 px-4 py-10">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-background/90 shadow-2xl shadow-primary/10 backdrop-blur">
          <section className="hidden w-1/2 flex-col justify-between border-r border-border/50 bg-linear-to-br from-primary/90 via-primary/70 to-primary/50 p-10 text-primary-foreground lg:flex">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary-foreground/80">
                Popy Dashboard
              </p>
              <h2 className="mt-6 text-3xl font-semibold leading-tight">
                Manage your platform with clarity and confidence
              </h2>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Simple tools, powerful insights, and a focused workspace designed
              to keep your team moving forward.
            </p>
          </section>

          <section className="relative flex w-full flex-col items-center justify-center bg-background px-6 py-10 sm:px-10 lg:w-1/2">
            <div className="w-full max-w-sm">
              <PublicRoute>{children}</PublicRoute>
            </div>
          </section>
        </div>
      </main>
  );
}
