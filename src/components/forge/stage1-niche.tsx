"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Niche } from "@/types";
import { ArrowRight, Heart, DollarSign, Users, Brain } from "lucide-react";

const NICHES: {
  id: Niche;
  icon: React.ElementType;
  label: string;
  tagline: string;
  examples: string;
  color: string;
}[] = [
  {
    id: "HEALTH",
    icon: Heart,
    label: "Health & Body",
    tagline: "Physical and reproductive health pain",
    examples: "Fertility, fibroids, skin, sleep, weight, chronic conditions, children's health",
    color: "group-hover:text-emerald-500 group-data-[selected=true]:text-emerald-500",
  },
  {
    id: "WEALTH",
    icon: DollarSign,
    label: "Wealth & Money",
    tagline: "Financial desperation and recovery",
    examples: "Debt, savings, side hustles, financial literacy, job loss, business failures",
    color: "group-hover:text-amber-500 group-data-[selected=true]:text-amber-500",
  },
  {
    id: "RELATIONSHIPS",
    icon: Users,
    label: "Relationships & Family",
    tagline: "Intimate and family conflict pain",
    examples: "Marriage, divorce, parenting, infidelity, in-law problems, loneliness",
    color: "group-hover:text-rose-500 group-data-[selected=true]:text-rose-500",
  },
  {
    id: "SELF_IMPROVEMENT",
    icon: Brain,
    label: "Self-Improvement",
    tagline: "Habits, mindset, and mental strength",
    examples: "Addiction, anxiety, procrastination, confidence, focus, faith, discipline",
    color: "group-hover:text-blue-500 group-data-[selected=true]:text-blue-500",
  },
];

interface Stage1Props {
  onNext: (niche: Niche, subNiche?: string) => void;
}

export function Stage1Niche({ onNext }: Stage1Props) {
  const [selected, setSelected] = useState<Niche | null>(null);
  const [subNiche, setSubNiche] = useState("");

  const handleNext = () => {
    if (!selected) return;
    onNext(selected, subNiche.trim() || undefined);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Choose your niche</h2>
        <p className="mt-1 text-muted-foreground">
          Pick one broad market. The AI will excavate 15–20 specific pain problems within it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {NICHES.map(({ id, icon: Icon, label, tagline, examples, color }) => (
          <button
            key={id}
            data-selected={selected === id}
            onClick={() => setSelected(id)}
            className={cn(
              "group relative rounded-xl border-2 bg-card p-5 text-left transition-all hover:border-primary/50 hover:bg-primary/5",
              selected === id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border"
            )}
          >
            <div className="mb-3">
              <Icon
                className={cn(
                  "size-6 text-muted-foreground transition-colors",
                  color
                )}
              />
            </div>
            <h3 className="font-semibold">{label}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{tagline}</p>
            <p className="mt-2 text-xs text-muted-foreground/70">{examples}</p>

            {selected === id && (
              <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary">
                <svg className="size-3 text-primary-foreground" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Sub-niche override */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
        <Label htmlFor="sub-niche" className="text-sm font-medium">
          Already have a specific sub-niche in mind? (optional)
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          e.g. &quot;fibroid treatment,&quot; &quot;bedwetting in older children,&quot; &quot;debt for Nigerian immigrants&quot;
        </p>
        <Input
          id="sub-niche"
          className="mt-3"
          placeholder="Type your specific sub-niche here..."
          value={subNiche}
          onChange={(e) => setSubNiche(e.target.value)}
        />
        {subNiche && (
          <p className="mt-2 text-xs text-primary">
            The AI will use &quot;{subNiche}&quot; as the starting direction, adapting the excavation accordingly.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2"
          disabled={!selected}
          onClick={handleNext}
        >
          Excavate pain problems
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
