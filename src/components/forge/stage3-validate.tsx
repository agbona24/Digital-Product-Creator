"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PainValidation } from "@/types";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, Trophy } from "lucide-react";

const VERDICT_CONFIG = {
  EXCELLENT: { color: "border-emerald-500/30 bg-emerald-500/5", badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Excellent", icon: "🏆" },
  STRONG: { color: "border-primary/30 bg-primary/5", badge: "bg-primary/10 text-primary border-primary/20", label: "Strong", icon: "✅" },
  VIABLE: { color: "border-amber-500/30 bg-amber-500/5", badge: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Viable", icon: "⚡" },
  WEAK: { color: "border-muted-foreground/20 bg-muted/30", badge: "bg-muted text-muted-foreground", label: "Weak", icon: "⚠️" },
};

const MARKET_CONFIG = {
  PASS: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  MARGINAL: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  FAIL: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

interface Stage3Props {
  validations: PainValidation[];
  isLoading: boolean;
  onNext: (chosenId: string) => void;
  onBack: () => void;
}

export function Stage3Validate({ validations, isLoading, onNext, onBack }: Stage3Props) {
  const [chosenId, setChosenId] = useState<string | null>(null);

  const sorted = [...validations].sort((a, b) => {
    const order = ["EXCELLENT", "STRONG", "VIABLE", "WEAK"];
    return order.indexOf(a.combinedVerdict) - order.indexOf(b.combinedVerdict);
  });

  if (isLoading) return <ValidationSkeleton />;

  const hasStrong = sorted.some((v) => ["EXCELLENT", "STRONG"].includes(v.combinedVerdict));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Market validation</h2>
        <p className="mt-1 text-muted-foreground">
          Each pain has been scored on urgency, embarrassment, and market reach — ranked best first.
          <strong> Choose the one pain you want to build your product around.</strong>
        </p>
      </div>

      {/* Ranked validation cards */}
      <div className="space-y-4">
        {sorted.map((v, rank) => (
          <ValidationCard
            key={v.painId}
            validation={v}
            rank={rank + 1}
            isChosen={chosenId === v.painId}
            isEligible={["EXCELLENT", "STRONG"].includes(v.combinedVerdict)}
            isDisabled={false}
            onToggle={() => setChosenId(v.painId)}
          />
        ))}
      </div>

      {!hasStrong && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
          <p className="font-medium text-amber-600 dark:text-amber-400">None of your pains scored EXCELLENT or STRONG.</p>
          <p className="mt-1 text-sm text-muted-foreground">You can still select any pain below — or go back and choose different ones.</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          size="lg"
          className="gap-2"
          disabled={!chosenId}
          onClick={() => chosenId && onNext(chosenId)}
        >
          <Trophy className="size-4" />
          Build product concept
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ValidationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20 ml-2" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidationCard({
  validation: v,
  rank,
  isChosen,
  isEligible,
  isDisabled,
  onToggle,
}: {
  validation: PainValidation;
  rank: number;
  isChosen: boolean;
  isEligible: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const verdict = VERDICT_CONFIG[v.combinedVerdict];

  return (
    <div className={cn("rounded-xl border-2 p-5 transition-all", verdict.color, isChosen && "ring-2 ring-primary ring-offset-2 ring-offset-background")}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background/50 text-xs font-bold">
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{v.painName}</h3>
            <Badge variant="outline" className={cn("text-xs", verdict.badge)}>
              {verdict.icon} {verdict.label}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Pain score: <strong>{v.survivalTest.total}/5</strong> · Market: <strong>{v.marketCheck.verdict}</strong>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Less" : "Details"}
          </Button>
          <Button
            size="sm"
            variant={isChosen ? "default" : "outline"}
            onClick={onToggle}
            className="text-xs"
          >
            {isChosen ? <CheckCircle2 className="mr-1 size-3.5" /> : null}
            {isChosen ? "Selected" : "Build this"}
          </Button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Survival test */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Survival-Level Test</p>
            <div className="space-y-1.5">
              {[
                { label: "Urgency", data: v.survivalTest.urgency },
                { label: "Embarrassment", data: v.survivalTest.embarrassment },
                { label: "Failed Attempts", data: v.survivalTest.failedAttempts },
                { label: "Identity Threat", data: v.survivalTest.identityThreat },
                { label: "Immediate Spend", data: v.survivalTest.immediateSpend },
              ].map(({ label, data }) => (
                <div key={label} className="flex items-start gap-2">
                  {data.score === "YES" ? (
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  )}
                  <div>
                    <span className="text-xs font-medium">{label}: </span>
                    <span className="text-xs text-muted-foreground">{data.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market check */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Check</p>
            <div className="space-y-1.5">
              {[
                { label: "Search Volume", data: v.marketCheck.searchVolume },
                { label: "Facebook Targeting", data: v.marketCheck.facebookTargeting },
                { label: "Competitor Presence", data: v.marketCheck.competitorPresence },
                { label: "Cross-Market Appeal", data: v.marketCheck.crossMarketAppeal },
                { label: "Low-Ticket Threshold", data: v.marketCheck.lowTicketThreshold },
              ].map(({ label, data }) => {
                const config = MARKET_CONFIG[data.score];
                const Icon = config.icon;
                return (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className={cn("mt-0.5 size-3.5 shrink-0", config.color)} />
                    <div>
                      <span className="text-xs font-medium">{label}: </span>
                      <span className="text-xs text-muted-foreground">{data.reason}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
