"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { number: 1, label: "Niche" },
  { number: 2, label: "Excavate" },
  { number: 3, label: "Validate" },
  { number: 4, label: "Concept" },
  { number: 5, label: "Ad Engine" },
  { number: 6, label: "Summary" },
  { number: 7, label: "Product" },
];

interface WizardStepperProps {
  currentStage: number;
}

export function WizardStepper({ currentStage }: WizardStepperProps) {
  return (
    <div className="w-full">
      {/* Mobile: compact progress bar */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStage - 1) / 6) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Stage {currentStage} of 7
        </span>
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStage;
          const isActive = step.number === currentStage;
          const isUpcoming = step.number > currentStage;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isActive && "border-primary bg-primary/10 text-primary",
                    isUpcoming && "border-muted-foreground/30 text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : step.number}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isActive && "text-foreground",
                    isCompleted && "text-primary",
                    isUpcoming && "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="mx-2 flex-1 mt-[-14px]">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
