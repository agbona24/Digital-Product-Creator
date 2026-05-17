"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PainProblem, Niche } from "@/types";
import { ArrowRight, Users, AlertTriangle, Globe, CheckCircle2 } from "lucide-react";

interface Stage2Props {
  niche: Niche;
  subNiche?: string;
  pains: PainProblem[];
  isLoading: boolean;
  onNext: (selectedIds: string[]) => void;
}

export function Stage2Excavate({ niche, subNiche, pains, isLoading, onNext }: Stage2Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const MIN_SELECT = 1;
  const MAX_SELECT = 5;

  const togglePain = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECT) {
        next.add(id);
      }
      return next;
    });
  };

  const canProceed = selectedIds.size >= MIN_SELECT;

  const nicheLabel = subNiche || niche.replace("_", " ");

  if (isLoading) {
    return <ExcavationSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pain excavation</h2>
          <p className="mt-1 text-muted-foreground">
            AI has surfaced <strong>{pains.length} survival-level pain problems</strong> within{" "}
            <span className="text-primary">{nicheLabel}</span>.
            Select <strong>1–5</strong> that hit hardest.
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-sm">
          {selectedIds.size}/{MAX_SELECT} selected
        </Badge>
      </div>

      {/* Selection counter */}
      {selectedIds.size === 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400">
          Select at least 1 pain to continue
        </div>
      )}
      {selectedIds.size >= MIN_SELECT && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-primary">
          <CheckCircle2 className="mr-1.5 inline size-4" />
          {selectedIds.size} selected — you can add {MAX_SELECT - selectedIds.size} more or proceed
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {pains.map((pain) => (
          <PainCard
            key={pain.id}
            pain={pain}
            isSelected={selectedIds.has(pain.id)}
            isDisabled={!selectedIds.has(pain.id) && selectedIds.size >= MAX_SELECT}
            onToggle={() => togglePain(pain.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground">
          {canProceed
            ? `${selectedIds.size} pain${selectedIds.size > 1 ? "s" : ""} selected — ready to validate`
            : "Select at least 1 pain to continue"}
        </p>
        <Button
          size="lg"
          className="gap-2"
          disabled={!canProceed}
          onClick={() => onNext(Array.from(selectedIds))}
        >
          Validate selected pains
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function PainCard({
  pain,
  isSelected,
  isDisabled,
  onToggle,
}: {
  pain: PainProblem;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={cn(
        "group relative rounded-xl border-2 bg-card p-5 text-left transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-border",
        isDisabled ? "cursor-not-allowed opacity-40" : "hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      {/* Number + selection indicator */}
      <div className="mb-3 flex items-center justify-between">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-xs font-bold",
            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {isSelected ? (
            <svg className="size-3.5" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            pain.number
          )}
        </div>
        <Badge variant="outline" className="text-xs">Pain #{pain.number}</Badge>
      </div>

      <h3 className="font-semibold leading-snug">{pain.name}</h3>

      <div className="mt-3 space-y-2.5 text-sm">
        <div className="flex gap-2">
          <Users className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">{pain.whoSuffers}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-xs italic leading-relaxed text-foreground/80">
          &ldquo;{pain.rawPain}&rdquo;
        </div>
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">{pain.whySurvivalLevel}</p>
        </div>
        <div className="flex gap-2">
          <Globe className="mt-0.5 size-3.5 shrink-0 text-blue-500" />
          <p className="text-xs text-muted-foreground">{pain.culturalAngle}</p>
        </div>
      </div>
    </button>
  );
}

function ExcavationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
