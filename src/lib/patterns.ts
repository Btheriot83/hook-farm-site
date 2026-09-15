export interface PatternDef {
  id: string;
  label: string;
  definition: string;
}

/** Packaging craft tags — glossary shown even when no cards exist yet. */
export const PATTERN_GLOSSARY: PatternDef[] = [
  {
    id: "curiosity_gap",
    label: "Curiosity gap",
    definition:
      "Opens a question or incomplete story that the viewer must watch to close.",
  },
  {
    id: "number",
    label: "Number",
    definition:
      "Leads with a concrete count (5 hacks, 23 ways, 97%) to promise scoped value.",
  },
  {
    id: "before_after",
    label: "Before / after",
    definition:
      "Contrasts a weak starting state with a transformed outcome.",
  },
  {
    id: "authority",
    label: "Authority",
    definition:
      "Signals expertise, official source, or hard-won experience up front.",
  },
  {
    id: "demo_first",
    label: "Demo first",
    definition:
      "Shows the result or product in motion before explaining how.",
  },
  {
    id: "list",
    label: "List",
    definition:
      "Frames the piece as a countable set of tips, ways, or steps.",
  },
  {
    id: "negative",
    label: "Negative",
    definition:
      "Uses forbidden, unfair, illegal, or destructive framing to raise stakes.",
  },
  {
    id: "secret",
    label: "Secret",
    definition:
      "Implies insider or hidden knowledge most people miss.",
  },
  {
    id: "replaced_job",
    label: "Replaced job",
    definition:
      "Claims income, role replacement, or automation that displaces labor.",
  },
  {
    id: "how_to_promise",
    label: "How-to promise",
    definition:
      "States a clear skill the viewer will learn by the end.",
  },
  {
    id: "tool_reveal",
    label: "Tool reveal",
    definition:
      "Centers a specific tool, stack, or workflow as the unlock.",
  },
];

export function patternLabel(id: string): string {
  return PATTERN_GLOSSARY.find((p) => p.id === id)?.label ?? id.replace(/_/g, " ");
}
