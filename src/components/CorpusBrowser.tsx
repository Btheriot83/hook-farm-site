"use client";

import { useMemo, useState } from "react";
import type { Card, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";
import { PATTERN_GLOSSARY, patternLabel } from "@/lib/patterns";
import { CardTile } from "./CardTile";
import { EmptyState } from "./EmptyState";

export function CorpusBrowser({ cards }: { cards: Card[] }) {
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [pattern, setPattern] = useState<string | "all">("all");

  const patternChips = useMemo(() => {
    const fromCards = new Set<string>();
    for (const c of cards) for (const t of c.pattern_tags) fromCards.add(t);
    const glossaryIds = PATTERN_GLOSSARY.map((p) => p.id);
    const extras = Array.from(fromCards)
      .filter((id) => !glossaryIds.includes(id))
      .sort();
    return [...glossaryIds, ...extras];
  }, [cards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (platform !== "all" && c.platform !== platform) return false;
      if (pattern !== "all" && !c.pattern_tags.includes(pattern)) return false;
      return true;
    });
  }, [cards, platform, pattern]);

  const isEmpty = cards.length === 0;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink/45">
            Platform
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={platform === "all"}
              onClick={() => setPlatform("all")}
              label="All"
            />
            {PLATFORMS.map((p) => (
              <FilterChip
                key={p}
                active={platform === p}
                onClick={() => setPlatform(p)}
                label={p}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink/45">
            Pattern
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={pattern === "all"}
              onClick={() => setPattern("all")}
              label="All"
            />
            {patternChips.map((id) => (
              <FilterChip
                key={id}
                active={pattern === id}
                onClick={() => setPattern(id)}
                label={patternLabel(id)}
              />
            ))}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <p className="border border-dashed border-ink/20 px-4 py-10 text-center text-ink/55">
          No cards match these filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card) => (
            <CardTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-sm border border-accent bg-accent/10 px-2.5 py-1 text-xs text-accent"
          : "rounded-sm border border-ink/15 bg-transparent px-2.5 py-1 text-xs text-ink/70 hover:border-ink/35"
      }
    >
      {label}
    </button>
  );
}
