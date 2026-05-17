import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Shovel,
  Target,
  Zap,
  BarChart3,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const STAGES = [
  { icon: Target, number: "01", label: "Choose your niche", desc: "Pick one of four broad markets to explore." },
  { icon: Shovel, number: "02", label: "Excavate pain problems", desc: "AI surfaces 15–20 survival-level pains in your niche." },
  { icon: BarChart3, number: "03", label: "Validate the market", desc: "Every pain is scored on urgency, embarrassment, and market reach." },
  { icon: Sparkles, number: "04", label: "Generate product concepts", desc: "Full buyer avatar, product framework, and 5 compelling titles." },
  { icon: Zap, number: "05", label: "Build your ad engine", desc: "Facebook/Instagram targeting and 5 scroll-stopping hooks." },
  { icon: FileText, number: "06", label: "Export your launch summary", desc: "One clean document ready for immediate action." },
];

const PROOF_POINTS = [
  "No personal experience required",
  "Works for Nigerian and international markets",
  "Each session takes under 30 minutes",
  "Validated products at ₦9,800 / $9.97 price point",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Shovel className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">NicheForge</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Log in
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <Sparkles className="size-3" />
          AI-powered product discovery
        </Badge>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Forge your next{" "}
          <span className="text-primary">digital product</span>{" "}
          from real pain
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          NicheForge excavates survival-level pain problems within any niche, validates the
          market automatically, and generates complete product concepts — so you can launch
          with confidence, even without personal experience in the topic.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Start forging for free <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            See a demo session
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {PROOF_POINTS.map((point) => (
            <span key={point} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              {point}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              From blank page to launch-ready in 6 stages
            </h2>
            <p className="text-muted-foreground">
              Each stage is guided by AI. Your only job is to make decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STAGES.map(({ icon: Icon, number, label, desc }) => (
              <div
                key={number}
                className="relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-muted-foreground/30">{number}</span>
                </div>
                <h3 className="mb-1.5 font-semibold">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Built for product creators who want to skip the guesswork
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            You do not need a personal story. You do not need years of experience.
            You need a niche direction and a system — NicheForge provides the system.
          </p>
          <p className="mb-10 text-base text-muted-foreground">
            Optimised for creators selling to <strong>Nigerian, African, and diaspora markets</strong>{" "}
            (UK, US, Canada) via Facebook and Instagram advertising.
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Create your first product idea <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NicheForge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
