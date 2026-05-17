"use server";

import { openai, MODEL, SYSTEM_PERSONA } from "@/lib/openai";
import type { Niche, PainProblem, PainValidation, ProductConcept, AdTargeting, LaunchSummary, ProductTitle, ProductContent } from "@/types";

// ─── Stage 2: Excavate 15-20 pain problems ──────────────────────────────────

export async function excavatePains(
  niche: Niche,
  subNiche?: string
): Promise<PainProblem[]> {
  const nicheDescriptions: Record<Niche, string> = {
    HEALTH: "Health & Body: physical health, traditional remedies, body issues, sexual health, fertility, chronic conditions, children's health, women's health, men's health, ageing, weight, skin, hair, pain, digestive issues, sleep problems",
    WEALTH: "Wealth & Money: debt, income, side hustles, financial literacy, savings, investment, job loss, career transitions, poverty mindset, business failures, money in relationships, financial abuse",
    RELATIONSHIPS: "Relationships & Family: marriage, divorce, parenting, dating, infidelity, sexual intimacy, in-law problems, single parenting, toxic relationships, loneliness, family conflict, child behaviour problems",
    SELF_IMPROVEMENT: "Self-Improvement & Mental Strength: addiction, confidence, habits, procrastination, anxiety, anger, shame, discipline, focus, purpose, faith, spiritual growth, trauma recovery, academic performance",
  };

  const direction = subNiche
    ? `The user has specified a specific sub-niche: "${subNiche}". Use this as your excavation direction within the broader ${niche} niche.`
    : `Niche selected: ${nicheDescriptions[niche]}`;

  const prompt = `${direction}

Excavate exactly 18 specific, raw, survival-level pain problems within this niche. Follow these critical rules:

RULE 1 — BE SPECIFIC: Do NOT say "weight loss." Say "post-wedding weight gain that a wife is hiding from her husband" or "belly fat that returned after the third child and makes her avoid mirrors."

CONTRAST EXAMPLE — WEAK (do NOT produce this):
"A woman who struggles with weight gain after pregnancy."

CONTRAST EXAMPLE — STRONG (produce this level of specificity):
"A 34-year-old Yoruba mother in Surulere who gained 22kg after her second emergency C-section and whose husband now sleeps in the guest room claiming exhaustion — she tries a new diet every January and quits by February because no plan accounts for the jollof rice, egusi soup, and puff-puff at every family gathering she cannot avoid. She dresses in the dark so he does not see her body. She has not worn a swimsuit since 2019."

RULE 2 — INCLUDE THE PERSON: Every problem must have a clear, specific sufferer — their age, gender, life stage, and exact situation. Vague sufferers produce vague products.

RULE 3 — INCLUDE CULTURAL TEXTURE: Surface problems with a Nigerian/African/diaspora angle — the mother-in-law pressure, the church shame, the keeping-up-appearances culture, the 'born abroad' identity crisis, the traditional healer vs. hospital tension, the family money secrets.

RULE 4 — SURFACE TABOO PROBLEMS: The most profitable niches are the ones people are too ashamed to discuss. Body odour in church. Sexual dysfunction in a Christian marriage. Bed-wetting in a 9-year-old whose parents threaten to send to the village. Masturbation addiction in a Muslim man. Infertility blamed on the wife. Go there without hesitation.

RULE 5 — THINK IN PRODUCTS: For each pain, mentally test whether it could become a compelling PDF with a title like "Mama Ngozi's [Problem] Protocol" or "The [Number]-Day [Mechanism] Reset." If a title does not come to mind easily, the pain is too vague — go deeper.

Return a JSON object with this exact structure:
{
  "pains": [
    {
      "id": "p1",
      "number": 1,
      "name": "short vivid name for this pain",
      "whoSuffers": "specific person — age, gender, life stage, cultural context",
      "rawPain": "2-3 sentences in first person as the person would say it at their lowest moment",
      "whySurvivalLevel": "one sentence explaining why they cannot ignore this problem",
      "culturalAngle": "what makes this pain especially acute for Nigerians/Africans/diaspora, or why it is universal"
    }
  ]
}`;

  console.log("[excavatePains] calling model:", MODEL);
  let response: Awaited<ReturnType<typeof openai.chat.completions.create>>;
  try {
    response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PERSONA },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 8000,
    });
  } catch (e) {
    console.error("[excavatePains] OpenAI API error:", e);
    throw e;
  }

  const raw = response.choices[0].message.content ?? "{}";
  try {
    const data = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());
    return (data.pains ?? []) as PainProblem[];
  } catch {
    console.error("[excavatePains] JSON parse failed. Raw:", raw.slice(0, 500));
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}

// ─── Stage 3: Validate selected pains ───────────────────────────────────────

export async function validatePains(
  pains: PainProblem[]
): Promise<PainValidation[]> {
  const painList = pains
    .map(
      (p) =>
        `Pain ID: ${p.id}\nName: ${p.name}\nWho suffers: ${p.whoSuffers}\nRaw pain: ${p.rawPain}\nWhy survival-level: ${p.whySurvivalLevel}\nCultural angle: ${p.culturalAngle}`
    )
    .join("\n\n---\n\n");

  const prompt = `Validate the following ${pains.length} pain problems. For each one, run BOTH tests automatically. Do NOT ask for user input — you assess everything based on your knowledge.

THE PAINS TO VALIDATE:
${painList}

SURVIVAL-LEVEL PAIN TEST (score each YES or NO):
1. URGENCY: Does the person feel they MUST solve this now, not later?
2. EMBARRASSMENT: Is this problem too shameful to discuss openly?
3. FAILED ATTEMPTS: Has this person already tried solutions that did not work?
4. IDENTITY THREAT: Does this problem threaten who they believe they are?
5. IMMEDIATE SPEND: Would this person pay ₦9,800 / $9.97 TODAY if the right solution appeared?

MARKET REACHABILITY CHECK (score each PASS, MARGINAL, or FAIL):
1. SEARCH VOLUME: Are people actively searching for solutions on Google, YouTube, Facebook?
2. FACEBOOK TARGETING: Can this audience be targeted via interests, behaviours, demographics on Facebook/Instagram?
3. COMPETITOR PRESENCE: Are other sellers already making money solving this with digital products?
4. CROSS-MARKET APPEAL: Does this problem exist in BOTH Nigeria and Tier 1 countries (UK, US, Canada)?
5. LOW-TICKET THRESHOLD: Is ₦9,800 / $9.97 a no-brainer given the pain level?

MARKET CHECK VERDICT rule (for the marketCheck.verdict field):
- PASS: 4-5 PASS scores in the market reachability check
- MARGINAL: 2-3 PASS scores
- FAIL: 0-1 PASS scores

COMBINED VERDICT rules (for the top-level combinedVerdict field):
- EXCELLENT: 5/5 survival + marketCheck.verdict is PASS
- STRONG: 4/5 survival + marketCheck.verdict is PASS or MARGINAL
- VIABLE: 3/5 survival + marketCheck.verdict is MARGINAL
- WEAK: less than 3/5 survival OR marketCheck.verdict is FAIL

Return a JSON object:
{
  "validations": [
    {
      "painId": "p1",
      "painName": "...",
      "survivalTest": {
        "urgency": { "score": "YES", "reason": "one-line reason" },
        "embarrassment": { "score": "YES", "reason": "one-line reason" },
        "failedAttempts": { "score": "YES", "reason": "one-line reason" },
        "identityThreat": { "score": "YES", "reason": "one-line reason" },
        "immediateSpend": { "score": "YES", "reason": "one-line reason" },
        "total": 5
      },
      "marketCheck": {
        "searchVolume": { "score": "PASS", "reason": "one-line reason" },
        "facebookTargeting": { "score": "PASS", "reason": "targeting angles" },
        "competitorPresence": { "score": "PASS", "reason": "what this tells us" },
        "crossMarketAppeal": { "score": "PASS", "reason": "diaspora buyer profile" },
        "lowTicketThreshold": { "score": "PASS", "reason": "one-line reason" },
        "verdict": "STRONG"
      },
      "combinedVerdict": "EXCELLENT"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PERSONA },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const data = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());
  return (data.validations ?? []) as PainValidation[];
}

// ─── Stage 4: Generate product concept ──────────────────────────────────────

export async function generateConcept(
  pain: PainProblem
): Promise<ProductConcept> {
  const prompt = `Generate a COMPLETE product concept for this survival-level pain. Do NOT ask for user input — you build everything.

THE PAIN:
Name: ${pain.name}
Who suffers: ${pain.whoSuffers}
Raw pain: ${pain.rawPain}
Why survival-level: ${pain.whySurvivalLevel}
Cultural angle: ${pain.culturalAngle}

DELIVER ALL OF THE FOLLOWING:

PART A — BUYER AVATAR:
Give this person a culturally appropriate Nigerian/African name. Define their exact age, gender, location (Nigerian city + diaspora city), and life stage. Write their pain in first person as if speaking at their lowest moment (3-5 sentences). List 3-5 failed solutions they have already tried with why each failed. Describe their perfect outcome vividly. Identify what would make them buy at ₦9,800 instantly.

PART B — PRODUCT FRAMEWORK:
Write a single-sentence core promise (what they get, how fast, at what effort cost). Choose a format (Protocol? 7-Day Plan? Blueprint? Ritual System?). Define a 3-phase transformation arc: Phase 1 Diagnose (what root cause you are exposing), Phase 2 Apply (specific action steps with timeframes), Phase 3 Maintain (how they keep results). Identify the Quick Win (something they can do in first 15-30 minutes). List 5+ tangible tools included. Choose a credibility mechanism (ancestral wisdom / clinical research / community validation).

PART C — 5 PRODUCT TITLES:
Generate exactly 5 titles. Each must have an "architecture" field set to EXACTLY one of these four values: "Ancestral", "Scientific", "Blended", "Emotional" — no other values allowed.

Titles 1-2 → architecture: "Ancestral"
Use village wisdom, grandmother rituals, elder protocols. The name must feel real and warm — not a placeholder.
WEAK EXAMPLE (do NOT produce): "Mama Ada's Health Protocol"
STRONG EXAMPLE (produce this quality): "Mama Ngozi's Womb Cleansing Ritual — The 7-Day Root and Leaf Protocol That Reversed My Fibroids Without Surgery"
More patterns: "Papa [Name]'s [Subject] [Method]", "The Old [Village/Cultural] [Remedy] [System]", "Aunty [Name]'s [Number]-Day [Specific Problem] Reset"

Titles 3-4 → architecture: "Scientific"
Use clinical-sounding language, biological processes, and measurable outcomes.
STRONG EXAMPLE: "The Endometrial Reset Protocol — 21 Days to Shrink Fibroids Naturally Using the Oestrogen Detox Method"
More patterns: "The [Biological Process] [Action] Protocol", "The [Number]-Day [Clinical Term] [Reversal/Elimination] Blueprint"

Title 5 → architecture: "Emotional"
Pure emotional framing. Speak directly to the shame, fear, or desperate hope.
STRONG EXAMPLE: "No More Hiding — The Complete Guide for the Woman Who Has Tried Everything and Still Cannot [Specific Problem]"
More patterns: "The Last Time — [Emotional Promise]", "Finally [Outcome] — [Specific Pain] Solved in [Timeframe]"

CRITICAL TITLE RULES:
- Every title must make the reader immediately recognise their exact pain OR desire the outcome OR trigger unstoppable curiosity
- Be SPECIFIC — not "Health Protocol" but "Fibroid Melter Protocol"; not "Sleep Better" but "The Adrenal Reset That Stops 3am Wake-Ups Without Sleeping Pills"
- Each title must work as a Facebook ad headline. Would a woman scrolling her phone at midnight, in pain, stop and click?
- Include a subtitle for every title that deepens the promise or adds specificity

Return a JSON object:
{
  "concept": {
    "painId": "${pain.id}",
    "buyerAvatar": {
      "name": "culturally appropriate name",
      "age": "specific age or narrow range",
      "gender": "Male or Female",
      "location": "Primary: Nigerian city | Secondary: diaspora city",
      "lifeStage": "specific life circumstance",
      "painInOwnWords": "3-5 sentences in first person at their lowest moment",
      "failedSolutions": ["solution 1 — why it failed", "solution 2 — why it failed", "solution 3 — why it failed"],
      "perfectOutcome": "vivid, specific, emotional description of life after the problem is solved",
      "buyingTrigger": "the specific element that triggers instant purchase at ₦9,800"
    },
    "framework": {
      "corePromise": "one sentence: what buyer gets, how fast, at what effort cost",
      "format": "Protocol / 7-Day Plan / Blueprint / Ritual System",
      "phase1Diagnose": "what root cause are you exposing",
      "phase2Apply": "specific action steps, remedies, strategies, timeframes",
      "phase3Maintain": "how the buyer keeps results permanently",
      "quickWin": "one thing the buyer can do in first 15-30 minutes that produces a noticeable result",
      "toolsIncluded": ["tool 1", "tool 2", "tool 3", "tool 4", "tool 5"],
      "credibilityMechanism": "ancestral wisdom / clinical research / community validation / traditional healer knowledge"
    },
    "titles": [
      {
        "number": 1,
        "architecture": "Ancestral",
        "fullTitle": "complete product title",
        "subtitle": "one line that deepens the promise",
        "painAddressed": "what specific suffering does this title speak to",
        "transformationPromised": "what result does this title imply",
        "emotionalHook": "what feeling does this trigger: Relief, Curiosity, Hope, Urgency, or Recognition",
        "facebookAdTest": { "passes": true, "reason": "why this would stop the scroll" }
      }
    ]
  }
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PERSONA },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 8000,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const data = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());
  return data.concept as ProductConcept;
}

// ─── Stage 5: Generate ad targeting and hooks ────────────────────────────────

export async function generateAdEngine(
  pain: PainProblem,
  chosenTitle: ProductTitle,
  buyerAvatar: ProductConcept["buyerAvatar"]
): Promise<AdTargeting> {
  const prompt = `Generate a complete Facebook/Instagram ad strategy for this product.

PRODUCT: ${chosenTitle.fullTitle}
SUBTITLE: ${chosenTitle.subtitle}
PAIN: ${pain.name} — ${pain.rawPain}
BUYER: ${buyerAvatar.name}, ${buyerAvatar.age}, ${buyerAvatar.gender}, ${buyerAvatar.location}
BUYER'S PAIN IN THEIR WORDS: ${buyerAvatar.painInOwnWords}

DELIVER:

PRIMARY AUDIENCE (Nigerian local market):
- Specific age range and gender
- 6-8 targetable Facebook/Instagram interests (things they actually follow or engage with)
- 3-4 relevant behaviours in Ads Manager
- A custom targeting angle unique to this pain

SECONDARY AUDIENCE (diaspora — UK, US, Canada):
- Specific age range and gender
- 5-7 cities with large Nigerian/African populations in UK, US, Canada
- 6-8 interests that target diaspora specifically
- 3-4 relevant behaviours
- How to specifically reach diaspora cultural communities

ESTIMATED COMBINED AUDIENCE SIZE (rough estimate based on targeting parameters)

5 SCROLL-STOPPING AD HOOKS:
Write 5 opening lines for Facebook/Instagram ads. Each must speak the buyer's exact pain back to them in language they use themselves — not marketing language, but the words they whisper to themselves at 2am.

WEAK HOOK (do NOT write): "Are you struggling with your health? This might help."
STRONG HOOK (write at this level): "She had tried 4 diets, 2 personal trainers, and a detox tea that cost ₦12,000. Her husband stopped looking at her that way two years ago. She just turned 37."

One of each type:
1. Emotional pain hook — name the specific shame, fear, or humiliation they carry daily
2. Curiosity/secret hook — tease a specific mechanism or root cause they have never heard of
3. Failed attempts hook — list the exact things they have already tried that failed, by name
4. Identity/shame hook — speak to who they believe they are because of this problem
5. Outcome/transformation hook — paint the exact moment their life changes after the solution

Return a JSON object:
{
  "targeting": {
    "primary": {
      "ageRange": "25-45",
      "gender": "Female",
      "interests": ["interest 1", "interest 2"],
      "behaviours": ["behaviour 1", "behaviour 2"],
      "customAngle": "what makes this targeting unique for this pain"
    },
    "secondary": {
      "ageRange": "26-44",
      "gender": "Female",
      "locations": ["London", "Manchester", "Houston"],
      "interests": ["interest 1", "interest 2"],
      "behaviours": ["behaviour 1", "behaviour 2"],
      "culturalTargeting": "how to reach diaspora specifically"
    },
    "estimatedAudienceSize": "2M-4M primary + 500K-1M diaspora",
    "hooks": [
      { "type": "Emotional", "text": "the full hook text" },
      { "type": "Curiosity", "text": "the full hook text" },
      { "type": "Failed Attempts", "text": "the full hook text" },
      { "type": "Identity", "text": "the full hook text" },
      { "type": "Outcome", "text": "the full hook text" }
    ]
  }
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PERSONA },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 8000,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const data = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());
  return data.targeting as AdTargeting;
}

// ─── Stage 6: Generate launch summary ───────────────────────────────────────

export async function generateLaunchSummary(
  pain: PainProblem,
  concept: ProductConcept,
  chosenTitle: ProductTitle,
  targeting: AdTargeting
): Promise<LaunchSummary> {
  const prompt = `Compile a final Product Launch Summary from the following validated research. Be concise and precise — this is the working document.

NICHE: ${pain.culturalAngle}
PAIN: ${pain.name} — ${pain.rawPain}
BUYER: ${concept.buyerAvatar.name}, ${concept.buyerAvatar.age}, ${concept.buyerAvatar.gender}, ${concept.buyerAvatar.location}, ${concept.buyerAvatar.lifeStage}
PRODUCT TITLE: ${chosenTitle.fullTitle}
SUBTITLE: ${chosenTitle.subtitle}
CORE PROMISE: ${concept.framework.corePromise}
FORMAT: ${concept.framework.format}
PHASE 1: ${concept.framework.phase1Diagnose}
PHASE 2: ${concept.framework.phase2Apply}
PHASE 3: ${concept.framework.phase3Maintain}
QUICK WIN: ${concept.framework.quickWin}
TOOLS: ${concept.framework.toolsIncluded.join(", ")}
CREDIBILITY: ${concept.framework.credibilityMechanism}
PRIMARY TARGETING: ${targeting.primary.gender} ${targeting.primary.ageRange}, Nigeria — ${targeting.primary.interests.slice(0, 3).join(", ")}
DIASPORA TARGETING: ${targeting.secondary.locations.slice(0, 3).join(", ")} — ${targeting.secondary.interests.slice(0, 3).join(", ")}
TOP HOOKS: ${targeting.hooks.slice(0, 3).map((h) => h.text).join(" | ")}

Return a JSON object:
{
  "summary": {
    "niche": "one-line niche description",
    "survivalLevelPain": "2 sentences describing the pain in raw human terms",
    "avatar": {
      "name": "${concept.buyerAvatar.name}",
      "age": "${concept.buyerAvatar.age}",
      "gender": "${concept.buyerAvatar.gender}",
      "location": "${concept.buyerAvatar.location}",
      "lifeStage": "${concept.buyerAvatar.lifeStage}",
      "painInOwnWords": "2-3 sentences"
    },
    "productTitle": "${chosenTitle.fullTitle}",
    "subtitle": "${chosenTitle.subtitle}",
    "format": "${concept.framework.format}",
    "priceNGN": "₦9,800",
    "priceUSD": "$9.97",
    "corePromise": "${concept.framework.corePromise}",
    "transformationArc": {
      "phase1": "summary of diagnose phase",
      "phase2": "summary of apply phase",
      "phase3": "summary of maintain phase"
    },
    "quickWin": "${concept.framework.quickWin}",
    "toolsIncluded": ${JSON.stringify(concept.framework.toolsIncluded)},
    "credibilityMechanism": "${concept.framework.credibilityMechanism}",
    "adTargetingPrimary": "one-line summary of primary audience",
    "adTargetingSecondary": "one-line summary of diaspora audience",
    "topHooks": ["hook 1", "hook 2", "hook 3"],
    "immediateNextStep": "One specific, doable action the creator takes TODAY — name the exact tool, platform, or physical object they open first. Not 'start writing' but 'Open a Google Doc titled [exact product title], create 5 sections matching the 3-phase arc plus introduction and conclusion, and write the first 200 words of the introduction describing the buyer at their worst moment. This takes 30 minutes.'"
  }
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PERSONA },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });

  const raw = response.choices[0].message.content ?? "{}";
  const data = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());
  return data.summary as LaunchSummary;
}

// ─── Stage 7: Generate full product content (two parallel calls) ─────────────

export async function generateProduct(
  pain: PainProblem,
  concept: ProductConcept,
  chosenTitle: ProductTitle
): Promise<ProductContent> {
  const context = `PRODUCT: ${chosenTitle.fullTitle}
SUBTITLE: ${chosenTitle.subtitle}
FORMAT: ${concept.framework.format}

BUYER: ${concept.buyerAvatar.name}, ${concept.buyerAvatar.age}, ${concept.buyerAvatar.gender}, ${concept.buyerAvatar.location}
LIFE STAGE: ${concept.buyerAvatar.lifeStage}
IN THEIR OWN WORDS: "${concept.buyerAvatar.painInOwnWords}"
FAILED SOLUTIONS: ${concept.buyerAvatar.failedSolutions.join("; ")}
PERFECT OUTCOME: ${concept.buyerAvatar.perfectOutcome}

PAIN: ${pain.name} — ${pain.rawPain}
ROOT CAUSE (Phase 1): ${concept.framework.phase1Diagnose}
PROTOCOL (Phase 2): ${concept.framework.phase2Apply}
MAINTENANCE (Phase 3): ${concept.framework.phase3Maintain}
QUICK WIN: ${concept.framework.quickWin}
TOOLS: ${concept.framework.toolsIncluded.join(", ")}
CREDIBILITY: ${concept.framework.credibilityMechanism}`;

  const writingRules = `WRITING RULES (apply to every word):
- Second person ("you"), warm, direct — like a trusted friend who has lived this
- Cultural texture is mandatory: Nigerian/African foods, family dynamics, social pressures, language. Make it feel written FOR this person, not for everyone
- Every step must be specific and doable. Not "reduce stress" but "Every evening for 7 days, sit quietly for 10 minutes with warm water and do the following..."
- Paragraphs must be 4-6 sentences minimum — no thin, generic content
- The buyer should feel seen before they read a single remedy`;

  const promptA = `${context}

${writingRules}

Write PART A of this digital product guide. Return JSON:
{
  "coverPage": {
    "title": "${chosenTitle.fullTitle}",
    "subtitle": "${chosenTitle.subtitle}",
    "tagline": "One evocative line — the promise in a single breath. E.g. 'Because you have tried everything else. This time is different.'",
    "authorNote": "3-4 sentences from a warm, knowledgeable author who has helped many people through this exact problem. Specific, not generic. Reference the cultural context."
  },
  "introduction": {
    "heading": "Before We Begin — Your Story",
    "openingStory": "Write 5-6 substantial paragraphs (4-6 sentences each) describing the buyer's daily experience with this pain. Name the exact moment — the Sunday morning, the family gathering, the doctor's waiting room. Describe the feelings they have not admitted to anyone. Name the failed attempts they have already tried and the exact way each one let them down. End with the moment they decided they needed a real solution.",
    "whatYouWillLearn": ["Specific numbered learning 1", "Specific numbered learning 2", "Specific numbered learning 3", "Specific numbered learning 4", "Specific numbered learning 5", "Specific numbered learning 6"],
    "howToUseThisGuide": "Write 3 paragraphs explaining exactly how to work through this guide. Which section to start with and why. How long each phase realistically takes. What to have ready before starting. What NOT to skip."
  },
  "quickWin": {
    "heading": "Start Here — Your First 30 Minutes",
    "intro": "3 sentences explaining what this quick win is, why it works immediately, and what the buyer will feel differently within 30 minutes.",
    "steps": ["Step 1: exact specific action with specifics on duration, quantity, method", "Step 2: equally specific", "Step 3: equally specific", "Step 4: equally specific", "Step 5: equally specific"],
    "whatToExpect": "3 sentences describing exactly — physically and emotionally — what the buyer will notice after completing this. Be specific: 'You may feel...' or 'You will notice that...'"
  },
  "phase1": {
    "heading": "Phase 1: Understanding What Is Really Going On",
    "subheading": "The root cause nobody explained to you",
    "explanation": "Write 5-6 paragraphs (4-6 sentences each) explaining the root cause of the problem in plain, powerful language. Use analogies the buyer already understands from daily life. Explain clearly why every previous solution failed because it targeted the wrong thing. Reference the cultural context — what advice from family, church, or traditional sources was wrong and why. End with the specific mechanism this guide targets.",
    "steps": [
      { "title": "Step 1: [specific name]", "content": "4-5 sentences of specific, actionable instructions for this diagnostic step" },
      { "title": "Step 2: [specific name]", "content": "4-5 sentences" },
      { "title": "Step 3: [specific name]", "content": "4-5 sentences" },
      { "title": "Step 4: [specific name]", "content": "4-5 sentences" }
    ],
    "keyInsight": "One powerful, memorable sentence that captures the core truth of Phase 1 — said so plainly that the buyer stops and reads it twice"
  }
}`;

  const promptB = `${context}

${writingRules}

Write PART B of this digital product guide. Return JSON:
{
  "phase2": {
    "heading": "Phase 2: The Protocol — What You Do Now",
    "subheading": "Your step-by-step system with exact timeframes",
    "overview": "Write 3 paragraphs introducing Phase 2. What is about to happen. Why this sequence — and not any other order — is what makes it work. What to realistically expect in the first 3 days, the first week, and the end of week 2. Be honest about the hard parts.",
    "steps": [
      { "title": "Day 1–3: [specific action name]", "content": "5-6 sentences of detailed, specific instructions — exactly what to do, when, how many times, what quantities, what to avoid, and what to do if it feels uncomfortable", "timeframe": "Day 1–3" },
      { "title": "Day 4–7: [specific action name]", "content": "5-6 sentences equally detailed", "timeframe": "Day 4–7" },
      { "title": "Week 2: [specific action name]", "content": "5-6 sentences", "timeframe": "Week 2" },
      { "title": "Week 3: [specific action name]", "content": "5-6 sentences", "timeframe": "Week 3" },
      { "title": "Week 4: [specific action name]", "content": "5-6 sentences — what the buyer should be experiencing by now and how to consolidate", "timeframe": "Week 4" }
    ],
    "importantNotes": "4-5 sentences covering: what to do if they miss a day (no shame, here is how to restart), what physical or emotional reactions are normal and why, one critical mistake that reverses progress, and one thing that will tell them it is working"
  },
  "phase3": {
    "heading": "Phase 3: Making This Permanent — Your Maintenance System",
    "subheading": "How to keep every result you have earned",
    "overview": "Write 3 paragraphs on why results disappear without a maintenance system, what maintenance looks like in real daily life, and how this phase is lighter than Phase 2 but equally important.",
    "habits": [
      { "habit": "Specific habit name", "why": "2 sentences on the biological or psychological mechanism that makes this habit protective", "frequency": "Exact frequency and timing — e.g. Every morning before the first meal" },
      { "habit": "Second habit", "why": "2 sentences", "frequency": "Exact frequency" },
      { "habit": "Third habit", "why": "2 sentences", "frequency": "Exact frequency" },
      { "habit": "Fourth habit", "why": "2 sentences", "frequency": "Weekly" },
      { "habit": "Fifth habit", "why": "2 sentences", "frequency": "Monthly or as needed" }
    ],
    "maintenanceSchedule": "Write a full weekly schedule paragraph: Monday morning routine, midweek check-in, weekend reset. Make it feel doable alongside real Nigerian/African family life."
  },
  "conclusion": {
    "heading": "You Made It This Far. That Is Not Nothing.",
    "message": "Write 4-5 substantial paragraphs. First: acknowledge exactly how hard the journey has been — name the specific struggles from this pain. Second: celebrate what they now have — a system, not just hope. Third: speak directly to the fear that it might not work for them and dismantle it with warmth. Fourth: paint the specific picture of their life 30 days from now if they follow this. Fifth: send them forward with the kind of quiet confidence of someone who knows they have given them everything they need.",
    "callToAction": "One specific, actionable sentence for the next 5 minutes — name the exact first thing to do",
    "reminder": "A single warm, memorable line — the kind a mentor says at the door as you leave"
  }
}`;

  const [responseA, responseB] = await Promise.all([
    openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PERSONA }, { role: "user", content: promptA }],
      temperature: 0.85,
      max_tokens: 16000,
    }),
    openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PERSONA }, { role: "user", content: promptB }],
      temperature: 0.85,
      max_tokens: 16000,
    }),
  ]);

  const parseJson = (s: string) =>
    JSON.parse(s.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim());

  const partA = parseJson(responseA.choices[0].message.content ?? "{}");
  const partB = parseJson(responseB.choices[0].message.content ?? "{}");

  return {
    coverPage: partA.coverPage,
    introduction: partA.introduction,
    quickWin: partA.quickWin,
    phase1: partA.phase1,
    phase2: partB.phase2,
    phase3: partB.phase3,
    conclusion: partB.conclusion,
  } as ProductContent;
}
