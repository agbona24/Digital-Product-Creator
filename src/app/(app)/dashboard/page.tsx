import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { cn } from "@/lib/utils";
import { Plus, Shovel, ArrowRight, Clock } from "lucide-react";
import type { Project } from "@/generated/prisma/client";

const STAGE_LABELS = [
  "Not started",
  "Niche selected",
  "Pains excavated",
  "Pains validated",
  "Concept created",
  "Ad engine done",
  "Summary ready",
  "Product built",
];

const NICHE_COLORS: Record<string, string> = {
  HEALTH: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  WEALTH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  RELATIONSHIPS: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  SELF_IMPROVEMENT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your products</h1>
          <p className="mt-1 text-muted-foreground">
            Each session walks you through 7 stages to a launch-ready digital product.
          </p>
        </div>
        <Link href="/forge" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="size-4" />
          New session
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <SessionCard key={project.id} project={project} />
          ))}
          <NewSessionCard />
        </div>
      )}
    </div>
  );
}

function SessionCard({ project }: { project: Project }) {
  const totalStages = 7;
  const progress = Math.round((project.currentStage / totalStages) * 100);
  const stageLabel = STAGE_LABELS[project.currentStage] ?? "Unknown";
  const nicheColor = project.niche ? NICHE_COLORS[project.niche] : "";
  const isComplete = project.currentStage >= 7;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight line-clamp-2">{project.name}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatDate(project.updatedAt)}
            </div>
          </div>
          <DeleteProjectButton projectId={project.id} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-3">
          {project.niche && (
            <Badge variant="outline" className={nicheColor}>
              {project.niche.replace("_", " ")}
            </Badge>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{stageLabel}</span>
              <span className="font-medium">{project.currentStage}/{totalStages}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href="/forge"
          className={cn(
            buttonVariants({
              variant: isComplete ? "outline" : "default",
              size: "sm",
            }),
            "w-full gap-2"
          )}
        >
          {isComplete ? "View session" : "New session"}
          <ArrowRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}

function NewSessionCard() {
  return (
    <Link href="/forge">
      <Card className="flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Plus className="size-5 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">New session</p>
          <p className="text-sm text-muted-foreground">Discover a new product idea</p>
        </div>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Shovel className="size-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start your first session to go from zero to a complete, sellable digital product in under 45 minutes.
      </p>
      <Link href="/forge" className={cn(buttonVariants(), "mt-6 gap-2")}>
        <Plus className="size-4" />
        Start your first session
      </Link>
    </div>
  );
}
