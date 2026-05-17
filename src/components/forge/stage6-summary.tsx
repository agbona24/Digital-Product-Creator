"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LaunchSummary } from "@/types";
import {
  Copy,
  Download,
  CheckCircle2,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  User,
  Package,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Stage6Props {
  summary: LaunchSummary | null;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function Stage6Summary({ summary, isLoading, onBack, onNext }: Stage6Props) {
  const [copied, setCopied] = useState(false);

  if (isLoading || !summary) return <SummarySkeleton isLoading={isLoading} onBack={onBack} />;

  const copyAll = () => {
    const text = formatSummaryAsText(summary);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Product Launch Summary</h2>
          </div>
          <p className="text-muted-foreground">
            Your complete, launch-ready product concept. Copy, export, or save to your dashboard.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={copyAll}>
            {copied ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy all"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary document */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Title block */}
        <div className="bg-primary/5 border-b border-border/50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Product Title</p>
          <h3 className="text-xl font-bold leading-snug">{summary.productTitle}</h3>
          <p className="mt-1 text-muted-foreground italic">{summary.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">{summary.format}</Badge>
            <Badge variant="outline" className="text-primary border-primary/30">{summary.priceNGN}</Badge>
            <Badge variant="outline">{summary.priceUSD}</Badge>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {/* Niche & Pain */}
          <SummarySection icon={Target} label="Niche & Survival-Level Pain">
            <InfoRow label="Niche" value={summary.niche} />
            <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm italic text-foreground/80">
              {summary.survivalLevelPain}
            </div>
          </SummarySection>

          {/* Avatar */}
          <SummarySection icon={User} label="Target Buyer Avatar">
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <InfoRow label="Name" value={summary.avatar.name} />
              <InfoRow label="Age" value={summary.avatar.age} />
              <InfoRow label="Gender" value={summary.avatar.gender} />
              <InfoRow label="Location" value={summary.avatar.location} />
              <InfoRow label="Life Stage" value={summary.avatar.lifeStage} />
            </div>
            <div className="mt-3 rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">In their own words</p>
              <p className="text-sm italic">&ldquo;{summary.avatar.painInOwnWords}&rdquo;</p>
            </div>
          </SummarySection>

          {/* Core Promise */}
          <SummarySection icon={Package} label="Core Promise">
            <p className="text-sm leading-relaxed">{summary.corePromise}</p>
          </SummarySection>

          {/* Transformation Arc */}
          <SummarySection icon={ArrowRight} label="Transformation Arc">
            <div className="space-y-2">
              {[
                { label: "Phase 1 — Diagnose", content: summary.transformationArc.phase1, color: "border-blue-500/20 bg-blue-500/5" },
                { label: "Phase 2 — Apply", content: summary.transformationArc.phase2, color: "border-primary/20 bg-primary/5" },
                { label: "Phase 3 — Maintain", content: summary.transformationArc.phase3, color: "border-emerald-500/20 bg-emerald-500/5" },
              ].map(({ label, content, color }) => (
                <div key={label} className={`rounded-lg border p-3 text-sm ${color}`}>
                  <p className="text-xs font-semibold text-muted-foreground mb-0.5">{label}</p>
                  <p>{content}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
                <Zap className="mr-1 inline size-3.5" />Quick Win
              </p>
              <p className="text-sm">{summary.quickWin}</p>
            </div>
          </SummarySection>

          {/* Tools */}
          <SummarySection icon={Package} label="Tools Included">
            <div className="flex flex-wrap gap-2">
              {summary.toolsIncluded.map((tool) => (
                <Badge key={tool} variant="secondary">{tool}</Badge>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Credibility: </span>{summary.credibilityMechanism}
            </p>
          </SummarySection>

          {/* Ad Targeting */}
          <SummarySection icon={Target} label="Facebook Ad Targeting">
            <div className="space-y-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Primary — Nigeria</p>
                <p className="text-sm">{summary.adTargetingPrimary}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Diaspora — UK/US/Canada</p>
                <p className="text-sm">{summary.adTargetingSecondary}</p>
              </div>
            </div>
          </SummarySection>

          {/* Top Hooks */}
          <SummarySection icon={Zap} label="Top 3 Ad Hooks">
            <div className="space-y-2">
              {summary.topHooks.map((hook, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{hook}</p>
                </div>
              ))}
            </div>
          </SummarySection>

          {/* Next Step */}
          <div className="px-6 py-5 bg-primary/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Your Immediate Next Step</p>
            <p className="text-sm font-medium leading-relaxed">{summary.immediateNextStep}</p>
          </div>
        </div>
      </div>

      {/* Closing message */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-6 text-center space-y-2">
        <Sparkles className="mx-auto size-8 text-primary" />
        <p className="font-semibold">You did not need to be an expert to get here.</p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your product title is compelling. Your buyer is defined. Your market is validated. Your ad hooks are written.
          You are not just creating a PDF — you are packaging a solution that desperate people are actively searching for right now.
          That solution has value. Go and sell it.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-6">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/forge"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Sparkles className="size-4" />
            New session
          </Link>
          <Button className="gap-2" onClick={onNext}>
            <ArrowRight className="size-4" />
            Build my product
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton({
  isLoading,
  onBack,
}: {
  isLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-primary/5 border-b border-border/50 px-6 py-5 space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-5 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Compiling your complete product launch summary…
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

function SummarySection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5 space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <p className="text-sm font-semibold">{label}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

function formatSummaryAsText(s: LaunchSummary): string {
  return `NICHEFORGE — PRODUCT LAUNCH SUMMARY
=====================================

PRODUCT TITLE: ${s.productTitle}
SUBTITLE: ${s.subtitle}
FORMAT: ${s.format}
PRICE: ${s.priceNGN} / ${s.priceUSD}

NICHE: ${s.niche}
SURVIVAL-LEVEL PAIN: ${s.survivalLevelPain}

BUYER AVATAR:
  Name: ${s.avatar.name} | Age: ${s.avatar.age} | Gender: ${s.avatar.gender}
  Location: ${s.avatar.location} | Life Stage: ${s.avatar.lifeStage}
  In their own words: "${s.avatar.painInOwnWords}"

CORE PROMISE: ${s.corePromise}

TRANSFORMATION ARC:
  Phase 1 — Diagnose: ${s.transformationArc.phase1}
  Phase 2 — Apply: ${s.transformationArc.phase2}
  Phase 3 — Maintain: ${s.transformationArc.phase3}

QUICK WIN: ${s.quickWin}

TOOLS INCLUDED:
${s.toolsIncluded.map((t) => `  • ${t}`).join("\n")}

CREDIBILITY MECHANISM: ${s.credibilityMechanism}

AD TARGETING:
  Primary (Nigeria): ${s.adTargetingPrimary}
  Diaspora (UK/US/Canada): ${s.adTargetingSecondary}

TOP 3 AD HOOKS:
${s.topHooks.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}

IMMEDIATE NEXT STEP: ${s.immediateNextStep}
`;
}
