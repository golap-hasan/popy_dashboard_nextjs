import Link from "next/link";
import { MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-112px)] items-center justify-center overflow-hidden bg-linear-to-b from-muted/40 via-background to-background px-4 py-16 rounded-lg">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/60 bg-background/80 p-10 text-center shadow-2xl shadow-primary/10 backdrop-blur">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-dashed border-primary/40 bg-primary/10 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Coming Soon
        </span>

        <h1 className="mt-6 text-3xl font-semibold text-foreground sm:text-4xl">
          Our revamped footer & resources hub is arriving shortly
        </h1>

        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          We are curating a footer experience packed with quick links, support resources, and brand highlights. Check back to explore the updated layout.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              <MoveLeft className="size-4" /> Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
