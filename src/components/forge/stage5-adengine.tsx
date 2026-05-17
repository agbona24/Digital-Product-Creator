"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdTargeting, ProductTitle } from "@/types";
import { ArrowRight, Target, Globe, Zap, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Stage5Props {
  chosenTitle: ProductTitle;
  targeting: AdTargeting | null;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const HOOK_COLORS: Record<string, string> = {
  Emotional: "border-rose-500/20 bg-rose-500/5",
  Curiosity: "border-purple-500/20 bg-purple-500/5",
  "Failed Attempts": "border-amber-500/20 bg-amber-500/5",
  Identity: "border-blue-500/20 bg-blue-500/5",
  Outcome: "border-emerald-500/20 bg-emerald-500/5",
};

const HOOK_BADGE_COLORS: Record<string, string> = {
  Emotional: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Curiosity: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Failed Attempts": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Identity: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Outcome: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export function Stage5AdEngine({ chosenTitle, targeting, isLoading, onNext, onBack }: Stage5Props) {
  const [copiedHook, setCopiedHook] = useState<number | null>(null);

  if (isLoading || !targeting)
    return (
      <AdEngineSkeleton
        isLoading={isLoading}
        chosenTitle={chosenTitle}
        onBack={onBack}
      />
    );

  const copyHook = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(index);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ad engine</h2>
        <p className="mt-1 text-muted-foreground">
          Facebook/Instagram targeting and 5 scroll-stopping hooks — ready to paste into Ads Manager.
        </p>
      </div>

      {/* Product title reminder */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Your chosen product</p>
        <p className="font-semibold">{chosenTitle.fullTitle}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{chosenTitle.subtitle}</p>
      </div>

      {/* Targeting */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Primary */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Target className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Primary audience</h3>
              <p className="text-xs text-muted-foreground">Nigeria — local market</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{targeting.primary.ageRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{targeting.primary.gender}</span>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {targeting.primary.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Behaviours</p>
              <div className="flex flex-wrap gap-1.5">
                {targeting.primary.behaviours.map((b) => (
                  <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Custom angle</p>
              <p className="text-xs">{targeting.primary.customAngle}</p>
            </div>
          </div>
        </div>

        {/* Secondary */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Globe className="size-4 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">Diaspora audience</h3>
              <p className="text-xs text-muted-foreground">UK · US · Canada</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{targeting.secondary.ageRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{targeting.secondary.gender}</span>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Locations</p>
              <div className="flex flex-wrap gap-1.5">
                {targeting.secondary.locations.map((l) => (
                  <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {targeting.secondary.interests.map((i) => (
                  <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Cultural targeting</p>
              <p className="text-xs">{targeting.secondary.culturalTargeting}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated reach */}
      <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Estimated combined audience</p>
          <p className="text-xs text-muted-foreground">Based on Facebook/Instagram targeting parameters</p>
        </div>
        <p className="text-lg font-bold text-primary">{targeting.estimatedAudienceSize}</p>
      </div>

      {/* Ad hooks */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h3 className="font-semibold">5 Scroll-Stopping Ad Hooks</h3>
        </div>
        <div className="space-y-3">
          {targeting.hooks.map((hook, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${HOOK_COLORS[hook.type] ?? ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Badge variant="outline" className={`mb-2 text-xs ${HOOK_BADGE_COLORS[hook.type] ?? ""}`}>
                    {hook.type} hook
                  </Badge>
                  <p className="text-sm leading-relaxed">{hook.text}</p>
                </div>
                <button
                  onClick={() => copyHook(hook.text, i)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground"
                  title="Copy hook"
                >
                  {copiedHook === i ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button size="lg" className="gap-2" onClick={onNext}>
          Generate launch summary
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function AdEngineSkeleton({
  isLoading,
  chosenTitle,
  onBack,
}: {
  isLoading: boolean;
  chosenTitle: ProductTitle;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* Chosen title reminder */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Your chosen product</p>
        <p className="font-semibold">{chosenTitle.fullTitle}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{chosenTitle.subtitle}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-5 space-y-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Building your Facebook/Instagram targeting and ad hooks…
        </p>
      )}
      <div className="flex justify-start border-t border-border/50 pt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
