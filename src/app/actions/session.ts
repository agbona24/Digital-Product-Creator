"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Niche, PainProblem, PainValidation, ProductConcept, ProductTitle, AdTargeting, LaunchSummary, ProductContent } from "@/types";

interface SaveSessionInput {
  niche: Niche;
  subNiche?: string;
  excavatedPains: PainProblem[];
  selectedPainIds: string[];
  validations: PainValidation[];
  chosenPainId: string;
  concept: ProductConcept;
  chosenTitle: ProductTitle;
  adTargeting: AdTargeting;
  launchSummary: LaunchSummary;
  productContent?: ProductContent;
}

export async function saveForgeSession(input: SaveSessionInput): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const name = input.chosenTitle.fullTitle;

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      name,
      niche: input.niche,
      subNiche: input.subNiche ?? null,
      currentStage: input.productContent ? 7 : 6,
      excavatedPains: JSON.stringify(input.excavatedPains),
      selectedPainIds: input.selectedPainIds.join(","),
      validations: JSON.stringify(input.validations),
      chosenValidationPainIds: input.chosenPainId,
      productConcepts: JSON.stringify(input.concept),
      chosenTitle: JSON.stringify(input.chosenTitle),
      adTargeting: JSON.stringify(input.adTargeting),
      launchSummary: JSON.stringify(input.launchSummary),
      productContent: input.productContent ? JSON.stringify(input.productContent) : null,
    },
  });

  return project.id;
}

export async function updateProjectProduct(projectId: string, productContent: ProductContent): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.project.update({
    where: { id: projectId, userId: session.user.id },
    data: {
      productContent: JSON.stringify(productContent),
      currentStage: 7,
    },
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.project.delete({
    where: { id: projectId, userId: session.user.id },
  });
}
