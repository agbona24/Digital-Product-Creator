"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ProductConcept, ProductTitle } from "@/types";
import { ArrowRight, User, Package, Type, Check, RefreshCw, Zap } from "lucide-react";

interface Stage4Props {
  concept: ProductConcept | null;
  isLoading: boolean;
  onNext: (chosenTitle: ProductTitle) => void;
  onBack: () => void;
}

export function Stage4Concept({ concept, isLoading, onNext, onBack }: Stage4Props) {
  const [chosenTitle, setChosenTitle] = useState<ProductTitle | null>(null);
  const [activeTab, setActiveTab] = useState("avatar");

  if (isLoading || !concept) return <ConceptSkeleton isLoading={isLoading} />;
  const selectedConcept = concept;
  const isFemale = selectedConcept.buyerAvatar.gender?.toLowerCase().includes("f");
  const pronoun = isFemale ? "her" : "his";
  const pronounCap = isFemale ? "Her" : "His";
  const pronounSubj = isFemale ? "she" : "he";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product concept</h2>
        <p className="mt-1 text-muted-foreground">
          Your buyer is defined, your framework is built, and 5 titles are ready to compare.
          Choose the one that hits hardest.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="avatar" className="gap-1.5">
            <User className="size-3.5" /> Buyer
          </TabsTrigger>
          <TabsTrigger value="framework" className="gap-1.5">
            <Package className="size-3.5" /> Framework
          </TabsTrigger>
          <TabsTrigger value="titles" className="gap-1.5">
            <Type className="size-3.5" /> Titles
            {chosenTitle && <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">✓</span>}
          </TabsTrigger>
        </TabsList>

        {/* Buyer Avatar */}
        <TabsContent value="avatar" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
                👤
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedConcept.buyerAvatar.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedConcept.buyerAvatar.age} · {selectedConcept.buyerAvatar.gender} · {selectedConcept.buyerAvatar.location}
                </p>
                <p className="mt-0.5 text-sm italic text-muted-foreground">{selectedConcept.buyerAvatar.lifeStage}</p>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">In {pronoun} own words</p>
              <p className="text-sm italic leading-relaxed">&ldquo;{selectedConcept.buyerAvatar.painInOwnWords}&rdquo;</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What {pronounSubj}&apos;s already tried (and failed)</p>
              <ul className="space-y-1.5">
                {selectedConcept.buyerAvatar.failedSolutions.map((sol, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive/60" />
                    <span className="text-muted-foreground">{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{pronounCap} perfect outcome</p>
              <p className="text-sm leading-relaxed">{selectedConcept.buyerAvatar.perfectOutcome}</p>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Zap className="mr-1 inline size-3.5" />What makes {pronounSubj} buy immediately
              </p>
              <p className="text-sm leading-relaxed">{selectedConcept.buyerAvatar.buyingTrigger}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="gap-2" onClick={() => setActiveTab("framework")}>
              View framework <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Product Framework */}
        <TabsContent value="framework" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Core Promise</p>
              <p className="font-medium leading-snug">{selectedConcept.framework.corePromise}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{selectedConcept.framework.format}</Badge>
                <Badge variant="outline">₦9,800 / $9.97</Badge>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transformation Arc</p>
              <div className="space-y-3">
                {[
                  { phase: "Phase 1 — Diagnose", content: selectedConcept.framework.phase1Diagnose, color: "border-blue-500/30 bg-blue-500/5" },
                  { phase: "Phase 2 — Apply", content: selectedConcept.framework.phase2Apply, color: "border-primary/30 bg-primary/5" },
                  { phase: "Phase 3 — Maintain", content: selectedConcept.framework.phase3Maintain, color: "border-emerald-500/30 bg-emerald-500/5" },
                ].map(({ phase, content, color }) => (
                  <div key={phase} className={cn("rounded-lg border p-4", color)}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{phase}</p>
                    <p className="mt-1 text-sm leading-relaxed">{content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Zap className="mr-1 inline size-3.5" />Quick win (first 15–30 minutes)
              </p>
              <p className="text-sm leading-relaxed">{selectedConcept.framework.quickWin}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools included</p>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.framework.toolsIncluded.map((tool) => (
                  <Badge key={tool} variant="secondary">{tool}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Credibility mechanism</p>
              <p className="text-sm text-muted-foreground">{selectedConcept.framework.credibilityMechanism}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="gap-2" onClick={() => setActiveTab("titles")}>
              Choose your title <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Titles */}
        <TabsContent value="titles" className="mt-4">
          <div className="space-y-4">
            {selectedConcept.titles.map((title) => (
              <TitleCard
                key={title.number}
                title={title}
                isChosen={chosenTitle?.number === title.number}
                onChoose={() => setChosenTitle(title)}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <RefreshCw className="size-4" /> Regenerate 5 more titles
            </Button>
            <Button
              size="lg"
              className="gap-2"
              disabled={!chosenTitle}
              onClick={() => chosenTitle && onNext(chosenTitle)}
            >
              Build ad strategy
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-start border-t border-border/50 pt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}

function ConceptSkeleton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-72" />
      <div className="rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-start gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Building your buyer avatar and product framework…
        </p>
      )}
    </div>
  );
}

function TitleCard({
  title,
  isChosen,
  onChoose,
}: {
  title: ProductTitle;
  isChosen: boolean;
  onChoose: () => void;
}) {
  const ARCH_COLORS: Record<string, string> = {
    Ancestral: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Scientific: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Blended: "bg-primary/10 text-primary border-primary/20",
    Emotional: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <button
      onClick={onChoose}
      className={cn(
        "group w-full rounded-xl border-2 bg-card p-5 text-left transition-all",
        isChosen ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", ARCH_COLORS[title.architecture])}>
              {title.architecture}
            </Badge>
            {title.facebookAdTest.passes && (
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                ✓ Scroll stopper
              </Badge>
            )}
          </div>
          <p className="mt-2 text-base font-bold leading-snug">{title.fullTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground italic">{title.subtitle}</p>
        </div>
        {isChosen && (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
            <Check className="size-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
        <div>
          <p className="font-semibold text-muted-foreground mb-0.5">Pain addressed</p>
          <p className="text-muted-foreground/80">{title.painAddressed}</p>
        </div>
        <div>
          <p className="font-semibold text-muted-foreground mb-0.5">Transformation</p>
          <p className="text-muted-foreground/80">{title.transformationPromised}</p>
        </div>
        <div>
          <p className="font-semibold text-muted-foreground mb-0.5">Emotional hook</p>
          <p className="text-muted-foreground/80">{title.emotionalHook}</p>
        </div>
      </div>
    </button>
  );
}
