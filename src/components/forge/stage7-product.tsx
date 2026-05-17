"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductContent, ProductTitle } from "@/types";
import { ArrowLeft, Download, Printer, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Stage7Props {
  product: ProductContent | null;
  chosenTitle: ProductTitle;
  isLoading: boolean;
  onBack: () => void;
}

export function Stage7Product({ product, chosenTitle, isLoading, onBack }: Stage7Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !product) {
    return <ProductSkeleton isLoading={isLoading} onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      {/* Action bar — hidden on print */}
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your product is ready</h2>
          <p className="mt-1 text-muted-foreground">
            Review the full content below. When satisfied, download as PDF.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
            <Printer className="size-4" />
            Print / Save PDF
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handlePrint}>
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* PDF Print tip */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm print:hidden">
        <strong>To save as PDF:</strong> Click &quot;Download PDF&quot; → In the print dialog, set Destination to &quot;Save as PDF&quot; → Click Save. For best results use Chrome or Edge.
      </div>

      {/* Product document */}
      <div ref={printRef} className="product-document">
        <style>{`
          @media print {
            body > * { display: none !important; }
            .print-target { display: block !important; }
            @page { size: A4; margin: 20mm 25mm; }
          }
        `}</style>

        <div className="print-target rounded-2xl border border-border overflow-hidden bg-white text-foreground">
          {/* Cover page */}
          <div className="bg-primary px-8 py-12 text-primary-foreground text-center print:min-h-[50vh] print:flex print:flex-col print:items-center print:justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70 mb-6">Digital Guide</p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight max-w-lg mx-auto">
              {product.coverPage.title}
            </h1>
            <p className="mt-4 text-base opacity-90 max-w-md mx-auto italic">
              {product.coverPage.subtitle}
            </p>
            <div className="mt-8 inline-block rounded-full border border-primary-foreground/30 px-6 py-2 text-sm font-medium opacity-90">
              {product.coverPage.tagline}
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Badge variant="secondary" className="text-foreground">₦9,800</Badge>
              <Badge variant="secondary" className="text-foreground">$9.97</Badge>
            </div>
          </div>

          {/* Author note */}
          <div className="border-b border-border/50 bg-muted/30 px-8 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">A note from the author</p>
            <p className="text-sm leading-relaxed italic text-muted-foreground">{product.coverPage.authorNote}</p>
          </div>

          <div className="divide-y divide-border/40">
            {/* Introduction */}
            <Section heading={product.introduction.heading}>
              <div className="prose prose-sm max-w-none">
                {product.introduction.openingStory.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-4 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">What you will learn in this guide</p>
                <ul className="space-y-2">
                  {product.introduction.whatYouWillLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold mt-0.5">{i + 1}</span>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">How to use this guide</p>
                <p className="text-sm leading-relaxed text-foreground/80">{product.introduction.howToUseThisGuide}</p>
              </div>
            </Section>

            {/* Quick win */}
            <Section heading={product.quickWin.heading} accent="amber">
              <p className="text-sm leading-relaxed mb-4 text-foreground/80">{product.quickWin.intro}</p>
              <ol className="space-y-3">
                {product.quickWin.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold mt-0.5">{i + 1}</span>
                    <p className="text-sm leading-relaxed text-foreground/90 pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-0.5">What to expect</p>
                <p className="text-sm text-foreground/80">{product.quickWin.whatToExpect}</p>
              </div>
            </Section>

            {/* Phase 1 */}
            <Section heading={product.phase1.heading} subheading={product.phase1.subheading} accent="blue">
              <div className="mb-5">
                {product.phase1.explanation.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="space-y-4">
                {product.phase1.steps.map((step, i) => (
                  <div key={i} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-1">{step.title}</p>
                    <p className="text-sm leading-relaxed text-foreground/80">{step.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Key insight</p>
                <p className="text-sm font-medium leading-relaxed">&ldquo;{product.phase1.keyInsight}&rdquo;</p>
              </div>
            </Section>

            {/* Phase 2 */}
            <Section heading={product.phase2.heading} subheading={product.phase2.subheading} accent="primary">
              <div className="mb-5">
                {product.phase2.overview.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="space-y-4">
                {product.phase2.steps.map((step, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{step.timeframe ?? `Step ${i + 1}`}</Badge>
                      <p className="font-semibold text-sm">{step.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{step.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-amber-500/5 border border-amber-500/20 p-4">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Important notes</p>
                <p className="text-sm leading-relaxed text-foreground/80">{product.phase2.importantNotes}</p>
              </div>
            </Section>

            {/* Phase 3 */}
            <Section heading={product.phase3.heading} subheading={product.phase3.subheading} accent="emerald">
              <div className="mb-5">
                {product.phase3.overview.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="space-y-3">
                {product.phase3.habits.map((h, i) => (
                  <div key={i} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">{h.habit}</p>
                      <Badge variant="outline" className="shrink-0 text-xs">{h.frequency}</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{h.why}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Your weekly maintenance schedule</p>
                <p className="text-sm leading-relaxed text-foreground/80">{product.phase3.maintenanceSchedule}</p>
              </div>
            </Section>

            {/* Conclusion */}
            <Section heading={product.conclusion.heading}>
              <div className="mb-4">
                {product.conclusion.message.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-center">
                <p className="text-sm font-medium text-primary">{product.conclusion.callToAction}</p>
              </div>
              <p className="mt-5 text-center text-xs italic text-muted-foreground">{product.conclusion.reminder}</p>
            </Section>
          </div>
        </div>
      </div>

      {/* Bottom actions — hidden on print */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-6 print:hidden">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            Dashboard
          </Link>
          <Link href="/forge" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            <Sparkles className="size-4" />
            New session
          </Link>
          <Button className="gap-2" onClick={handlePrint}>
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  heading,
  subheading,
  accent,
  children,
}: {
  heading: string;
  subheading?: string;
  accent?: "blue" | "primary" | "emerald" | "amber";
  children: React.ReactNode;
}) {
  const accentColors: Record<string, string> = {
    blue: "border-l-blue-500",
    primary: "border-l-primary",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
  };

  return (
    <div className={cn("px-8 py-7 border-l-4 border-l-transparent", accent && accentColors[accent])}>
      <h2 className="text-lg font-bold tracking-tight mb-0.5">{heading}</h2>
      {subheading && <p className="text-sm text-muted-foreground italic mb-5">{subheading}</p>}
      {!subheading && <div className="mb-5" />}
      {children}
    </div>
  );
}

function ProductSkeleton({ isLoading, onBack }: { isLoading: boolean; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="bg-primary/10 px-8 py-12 space-y-4 text-center">
          <Skeleton className="h-6 w-24 mx-auto rounded-full" />
          <Skeleton className="h-10 w-96 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="p-8 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-2 pt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Writing your complete product — this takes about 30 seconds…
        </p>
      )}
      <div className="flex justify-start border-t border-border/50 pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
