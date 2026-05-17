"use client";

import { useState } from "react";
import { WizardStepper } from "@/components/forge/wizard-stepper";
import { Stage1Niche } from "@/components/forge/stage1-niche";
import { Stage2Excavate } from "@/components/forge/stage2-excavate";
import { Stage3Validate } from "@/components/forge/stage3-validate";
import { Stage4Concept } from "@/components/forge/stage4-concept";
import { Stage5AdEngine } from "@/components/forge/stage5-adengine";
import { Stage6Summary } from "@/components/forge/stage6-summary";
import { Stage7Product } from "@/components/forge/stage7-product";
import {
  excavatePains,
  validatePains,
  generateConcept,
  generateAdEngine,
  generateLaunchSummary,
  generateProduct,
} from "@/app/actions/forge";
import { saveForgeSession, updateProjectProduct } from "@/app/actions/session";
import type {
  Niche,
  PainProblem,
  PainValidation,
  ProductConcept,
  ProductTitle,
  AdTargeting,
  LaunchSummary,
  ProductContent,
} from "@/types";

export default function ForgePage() {
  const [stage, setStage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Stage 1
  const [niche, setNiche] = useState<Niche>();
  const [subNiche, setSubNiche] = useState<string>();

  // Stage 2 — Excavate
  const [pains, setPains] = useState<PainProblem[]>([]);
  const [painsLoading, setPainsLoading] = useState(false);

  // Stage 2 → 3 — which pain objects the user picked
  const [selectedPains, setSelectedPains] = useState<PainProblem[]>([]);

  // Stage 3 — Validate
  const [validations, setValidations] = useState<PainValidation[]>([]);
  const [validationsLoading, setValidationsLoading] = useState(false);

  // Stage 3 → 4 — the single pain chosen for concept generation
  const [chosenPain, setChosenPain] = useState<PainProblem>();

  // Stage 4 — Concept
  const [concept, setConcept] = useState<ProductConcept | null>(null);
  const [conceptLoading, setConceptLoading] = useState(false);

  // Stage 4 → 5
  const [chosenTitle, setChosenTitle] = useState<ProductTitle | null>(null);

  // Stage 5 — Ad Engine
  const [targeting, setTargeting] = useState<AdTargeting | null>(null);
  const [targetingLoading, setTargetingLoading] = useState(false);

  // Stage 6 — Launch Summary
  const [summary, setSummary] = useState<LaunchSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Stage 7 — Product
  const [product, setProduct] = useState<ProductContent | null>(null);
  const [productLoading, setProductLoading] = useState(false);

  // Saved project ID (set after Stage 6 auto-save)
  const [projectId, setProjectId] = useState<string | null>(null);

  const goBack = () => {
    setError(null);
    setStage((s) => Math.max(s - 1, 1));
  };

  const handleStage1Next = async (n: Niche, sub?: string) => {
    setNiche(n);
    setSubNiche(sub);
    setError(null);
    setStage(2);
    setPainsLoading(true);
    try {
      const result = await excavatePains(n, sub);
      setPains(result);
    } catch {
      setError("Failed to excavate pains. Please try again.");
    } finally {
      setPainsLoading(false);
    }
  };

  const handleStage2Next = async (selectedIds: string[]) => {
    const selected = pains.filter((p) => selectedIds.includes(p.id));
    setSelectedPains(selected);
    setError(null);
    setStage(3);
    setValidationsLoading(true);
    try {
      const result = await validatePains(selected);
      setValidations(result);
    } catch {
      setError("Failed to validate pains. Please try again.");
    } finally {
      setValidationsLoading(false);
    }
  };

  const handleStage3Next = async (chosenId: string) => {
    const pain = selectedPains.find((p) => p.id === chosenId) ?? selectedPains[0];
    setChosenPain(pain);
    setError(null);
    setStage(4);
    setConceptLoading(true);
    try {
      const result = await generateConcept(pain);
      setConcept(result);
    } catch {
      setError("Failed to generate product concept. Please try again.");
    } finally {
      setConceptLoading(false);
    }
  };

  const handleStage4Next = async (title: ProductTitle) => {
    if (!chosenPain || !concept) return;
    setChosenTitle(title);
    setError(null);
    setStage(5);
    setTargetingLoading(true);
    try {
      const result = await generateAdEngine(
        chosenPain,
        title,
        concept.buyerAvatar
      );
      setTargeting(result);
    } catch {
      setError("Failed to generate ad strategy. Please try again.");
    } finally {
      setTargetingLoading(false);
    }
  };

  const handleStage5Next = async () => {
    if (!chosenPain || !concept || !chosenTitle || !targeting || !niche) return;
    setError(null);
    setStage(6);
    setSummaryLoading(true);
    try {
      const result = await generateLaunchSummary(chosenPain, concept, chosenTitle, targeting);
      setSummary(result);
      // Auto-save session to DB
      const id = await saveForgeSession({
        niche,
        subNiche,
        excavatedPains: pains,
        selectedPainIds: selectedPains.map((p) => p.id),
        validations,
        chosenPainId: chosenPain.id,
        concept,
        chosenTitle,
        adTargeting: targeting,
        launchSummary: result,
      });
      setProjectId(id);
    } catch {
      setError("Failed to generate launch summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleStage6Next = async () => {
    if (!chosenPain || !concept || !chosenTitle) return;
    setError(null);
    setStage(7);
    setProductLoading(true);
    try {
      const result = await generateProduct(chosenPain, concept, chosenTitle);
      setProduct(result);
      if (projectId) {
        await updateProjectProduct(projectId, result);
      }
    } catch {
      setError("Failed to generate product. Please try again.");
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <WizardStepper currentStage={stage} />

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 text-destructive/60 hover:text-destructive"
          >
            ✕
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        {stage === 1 && <Stage1Niche onNext={handleStage1Next} />}

        {stage === 2 && niche && (
          <Stage2Excavate
            niche={niche}
            subNiche={subNiche}
            pains={pains}
            isLoading={painsLoading}
            onNext={handleStage2Next}
          />
        )}

        {stage === 3 && (
          <Stage3Validate
            validations={validations}
            isLoading={validationsLoading}
            onNext={handleStage3Next}
            onBack={goBack}
          />
        )}

        {stage === 4 && (
          <Stage4Concept
            concept={concept}
            isLoading={conceptLoading}
            onNext={handleStage4Next}
            onBack={goBack}
          />
        )}

        {stage === 5 && chosenTitle && (
          <Stage5AdEngine
            chosenTitle={chosenTitle}
            targeting={targeting}
            isLoading={targetingLoading}
            onNext={handleStage5Next}
            onBack={goBack}
          />
        )}

        {stage === 6 && (
          <Stage6Summary
            summary={summary}
            isLoading={summaryLoading}
            onBack={goBack}
            onNext={handleStage6Next}
          />
        )}

        {stage === 7 && chosenTitle && (
          <Stage7Product
            product={product}
            chosenTitle={chosenTitle}
            isLoading={productLoading}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}
