export interface PatternDef {
  id: string;
  label: string;
  /** Craft definition — what the packaging move actually does. */
  definition: string;
  /** Conditions where the pattern tends to convert attention. */
  whenWorks: string;
  /** Conditions where it collapses or feels spammy. */
  whenFails: string;
  /** Pattern ids that often stack cleanly with this one. */
  combineWith: string[];
}

/** Packaging craft tags — glossary shown even when no cards exist yet. */
export const PATTERN_GLOSSARY: PatternDef[] = [
  {
    id: "curiosity_gap",
    label: "Curiosity gap",
    definition:
      "Opens an incomplete loop — a withheld payoff, unfinished claim, or unanswered question — so the viewer stays to close it.",
    whenWorks:
      "The gap is specific and believable (a named outcome, a visible contradiction). Payoff arrives early enough that retention does not feel bait.",
    whenFails:
      "Vague mystery with no concrete stake, or the reveal is weaker than the tease. Overuse trains audiences to scroll past.",
    combineWith: ["negative", "secret", "authority", "demo_first"],
  },
  {
    id: "number",
    label: "Number",
    definition:
      "Leads with a concrete count (5 hacks, 23 ways, 97%, $24,937) that scopes the promise and signals scannable value.",
    whenWorks:
      "The number is memorable and matches the actual structure (list length, time box, revenue claim). Odd or precise figures feel less stock.",
    whenFails:
      "Round clickbait (\"7 secrets\") with no delivery, or inflated metrics that break trust on first watch.",
    combineWith: ["list", "how_to_promise", "authority", "replaced_job"],
  },
  {
    id: "before_after",
    label: "Before / after",
    definition:
      "Contrasts a weak starting state with a transformed outcome so the delta — not the method — is the hook.",
    whenWorks:
      "Both states are concrete and recognizable to the niche. The after is shown or strongly implied in the first seconds.",
    whenFails:
      "Abstract \"struggle → success\" with no visible craft, or after that looks identical to every other creator's lifestyle flex.",
    combineWith: ["authority", "how_to_promise", "demo_first", "number"],
  },
  {
    id: "authority",
    label: "Authority",
    definition:
      "Signals expertise, hours invested, official access, or hard-won results before asking for attention.",
    whenWorks:
      "Proof is specific (hours, role, audited result) and relevant to the promise. Pairing with a teachable how-to keeps it from peacocking.",
    whenFails:
      "Empty credentials, borrowed prestige, or authority that contradicts the \"anyone can do this\" claim in the same hook.",
    combineWith: ["how_to_promise", "number", "tool_reveal", "before_after"],
  },
  {
    id: "demo_first",
    label: "Demo first",
    definition:
      "Shows the result, UI, or product in motion before explaining how — proof before pedagogy.",
    whenWorks:
      "The demo is legible in a silent scroll (clear screen, readable outcome). Works especially for tools and workflows.",
    whenFails:
      "Busy screen with no readable payoff, or talking-head claiming a demo that never appears.",
    combineWith: ["tool_reveal", "curiosity_gap", "how_to_promise", "authority"],
  },
  {
    id: "list",
    label: "List",
    definition:
      "Frames the piece as a countable set of tips, ways, or steps — packaging that promises modular value.",
    whenWorks:
      "Count matches delivery; items feel distinct. Strong with a number lead and a teachable niche.",
    whenFails:
      "Padded lists, duplicate tips, or a \"list\" that is really one tip restated N times.",
    combineWith: ["number", "how_to_promise", "negative", "tool_reveal"],
  },
  {
    id: "negative",
    label: "Negative",
    definition:
      "Uses forbidden, unfair, illegal, destructive, or \"you're doing it wrong\" framing to raise stakes and interrupt the feed.",
    whenWorks:
      "The threat or taboo maps to a real viewer fear (wasted time, bad habits, job risk) and resolves into useful craft.",
    whenFails:
      "Pure doom without a path, or \"feels illegal\" with tame content — audience feels tricked.",
    combineWith: ["curiosity_gap", "secret", "replaced_job", "list"],
  },
  {
    id: "secret",
    label: "Secret",
    definition:
      "Implies insider or hidden knowledge most people miss — scarcity of information as the reason to watch.",
    whenWorks:
      "The \"secret\" is a concrete technique or non-obvious constraint, not a recycled tip dressed as exclusive.",
    whenFails:
      "Everyone-already-knows advice, or secrets that require buying something before any reveal.",
    combineWith: ["negative", "curiosity_gap", "authority", "tool_reveal"],
  },
  {
    id: "replaced_job",
    label: "Replaced job",
    definition:
      "Claims income, role replacement, or automation that displaces labor — money or job anxiety as the stake.",
    whenWorks:
      "Tied to a specific workflow or dollar figure the viewer can evaluate; often paired with a how-to so it is not pure flex.",
    whenFails:
      "Unverifiable income flexes, or job-fear bait with no transferable craft.",
    combineWith: ["number", "negative", "how_to_promise", "authority"],
  },
  {
    id: "how_to_promise",
    label: "How-to promise",
    definition:
      "States a clear skill the viewer will leave with — learning contract in the first line.",
    whenWorks:
      "Skill is specific and finishable in the format (\"prompt formula\", \"Claude basics in 15 min\"). Pairs well with number and authority.",
    whenFails:
      "Vague \"master AI\" promises, or tutorials that abandon the promised skill for rant.",
    combineWith: ["number", "authority", "list", "tool_reveal"],
  },
  {
    id: "tool_reveal",
    label: "Tool reveal",
    definition:
      "Centers a specific tool, stack, or workflow as the unlock — the product or pipeline is the star.",
    whenWorks:
      "Tool is named early; demo or UI appears fast. Works when the niche already wants that class of tool.",
    whenFails:
      "Generic \"this AI\" with no named product, or reveal buried after a long monologue.",
    combineWith: ["demo_first", "curiosity_gap", "how_to_promise", "authority"],
  },
];

const byId = new Map(PATTERN_GLOSSARY.map((p) => [p.id, p]));

export function patternLabel(id: string): string {
  return byId.get(id)?.label ?? id.replace(/_/g, " ");
}

export function getPatternDef(id: string): PatternDef | undefined {
  return byId.get(id);
}

/** Fallback craft blurb for tags not yet in the glossary. */
export function patternDefinition(id: string): string {
  return (
    byId.get(id)?.definition ??
    `Packaging tag “${id.replace(/_/g, " ")}” seen on corpus cards — craft definition pending.`
  );
}
