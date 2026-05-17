export type Niche = "HEALTH" | "WEALTH" | "RELATIONSHIPS" | "SELF_IMPROVEMENT";

export interface PainProblem {
  id: string;
  number: number;
  name: string;
  whoSuffers: string;
  rawPain: string;
  whySurvivalLevel: string;
  culturalAngle: string;
}

export type ValidationScore = "YES" | "NO";
export type MarketScore = "PASS" | "MARGINAL" | "FAIL";
export type Verdict = "EXCELLENT" | "STRONG" | "VIABLE" | "WEAK";

export interface PainValidation {
  painId: string;
  painName: string;
  survivalTest: {
    urgency: { score: ValidationScore; reason: string };
    embarrassment: { score: ValidationScore; reason: string };
    failedAttempts: { score: ValidationScore; reason: string };
    identityThreat: { score: ValidationScore; reason: string };
    immediateSpend: { score: ValidationScore; reason: string };
    total: number;
  };
  marketCheck: {
    searchVolume: { score: MarketScore; reason: string };
    facebookTargeting: { score: MarketScore; reason: string };
    competitorPresence: { score: MarketScore; reason: string };
    crossMarketAppeal: { score: MarketScore; reason: string };
    lowTicketThreshold: { score: MarketScore; reason: string };
    verdict: "STRONG" | "VIABLE" | "WEAK";
  };
  combinedVerdict: Verdict;
}

export type TitleArchitecture = "Ancestral" | "Scientific" | "Blended" | "Emotional";

export interface ProductTitle {
  number: number;
  architecture: TitleArchitecture;
  fullTitle: string;
  subtitle: string;
  painAddressed: string;
  transformationPromised: string;
  emotionalHook: string;
  facebookAdTest: { passes: boolean; reason: string };
}

export interface BuyerAvatar {
  name: string;
  age: string;
  gender: string;
  location: string;
  lifeStage: string;
  painInOwnWords: string;
  failedSolutions: string[];
  perfectOutcome: string;
  buyingTrigger: string;
}

export interface ProductFramework {
  corePromise: string;
  format: string;
  phase1Diagnose: string;
  phase2Apply: string;
  phase3Maintain: string;
  quickWin: string;
  toolsIncluded: string[];
  credibilityMechanism: string;
}

export interface ProductConcept {
  painId: string;
  buyerAvatar: BuyerAvatar;
  framework: ProductFramework;
  titles: ProductTitle[];
}

export interface AdTargeting {
  primary: {
    ageRange: string;
    gender: string;
    interests: string[];
    behaviours: string[];
    customAngle: string;
  };
  secondary: {
    ageRange: string;
    gender: string;
    locations: string[];
    interests: string[];
    behaviours: string[];
    culturalTargeting: string;
  };
  estimatedAudienceSize: string;
  hooks: {
    type: "Emotional" | "Curiosity" | "Failed Attempts" | "Identity" | "Outcome";
    text: string;
  }[];
}

export interface LaunchSummary {
  niche: string;
  survivalLevelPain: string;
  avatar: Pick<BuyerAvatar, "name" | "age" | "gender" | "location" | "lifeStage" | "painInOwnWords">;
  productTitle: string;
  subtitle: string;
  format: string;
  priceNGN: string;
  priceUSD: string;
  corePromise: string;
  transformationArc: { phase1: string; phase2: string; phase3: string };
  quickWin: string;
  toolsIncluded: string[];
  credibilityMechanism: string;
  adTargetingPrimary: string;
  adTargetingSecondary: string;
  topHooks: string[];
  immediateNextStep: string;
}

export interface ProductContentStep {
  title: string;
  content: string;
  timeframe?: string;
}

export interface ProductContent {
  coverPage: {
    title: string;
    subtitle: string;
    tagline: string;
    authorNote: string;
  };
  introduction: {
    heading: string;
    openingStory: string;
    whatYouWillLearn: string[];
    howToUseThisGuide: string;
  };
  phase1: {
    heading: string;
    subheading: string;
    explanation: string;
    steps: ProductContentStep[];
    keyInsight: string;
  };
  phase2: {
    heading: string;
    subheading: string;
    overview: string;
    steps: ProductContentStep[];
    importantNotes: string;
  };
  phase3: {
    heading: string;
    subheading: string;
    overview: string;
    habits: Array<{ habit: string; why: string; frequency: string }>;
    maintenanceSchedule: string;
  };
  quickWin: {
    heading: string;
    intro: string;
    steps: string[];
    whatToExpect: string;
  };
  conclusion: {
    heading: string;
    message: string;
    callToAction: string;
    reminder: string;
  };
}

export interface ForgeSession {
  id: string;
  name: string;
  niche?: Niche;
  subNiche?: string;
  currentStage: number;
  excavatedPains?: PainProblem[];
  selectedPainIds?: string[];
  validations?: PainValidation[];
  chosenValidationPainIds?: string[];
  productConcepts?: ProductConcept[];
  chosenTitle?: ProductTitle;
  adTargeting?: AdTargeting;
  launchSummary?: LaunchSummary;
  createdAt: string;
  updatedAt: string;
}
