"use client";

import { useMemo, useState } from "react";
import type { Card, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";
import { PATTERN_GLOSSARY, patternLabel } from "@/lib/patterns";
import { engagementScore } from "@/lib/thumbs";
import { CardTile } from "./CardTile";
import { EmptyState } from "./EmptyState";

type SortKey =
  | "views"
  | "likes"
  | "comments"
  | "saves"
  | "collected"
  | "post_date"
  | "engagement";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "views", label: "Views" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "saves", label: "Saves" },
  { key: "collected", label: "Newest collected" },
  { key: "post_date", label: "Newest post date" },
  { key: "engagement", label: "Engagement" },
];

function metricValue(card: Card, key: SortKey): number | null {
  switch (key) {
    case "views":
      return card.views;
    case "likes":
      return card.likes;
    case "comments":
      return card.comments;
    case "saves":
      return card.saves;
    case "collected": {
      const t = Date.parse(card.collected_at);
      return Number.isFinite(t) ? t : null;
    }
    case "post_date": {
      if (!card.post_date) return null;
      const t = Date.parse(card.post_date);
      return Number.isFinite(t) ? t : null;
    }
    case "engagement":
      return engagementScore(card);
  }
}

function compareCards(
  a: Card,
  b: Card,
  key: SortKey,
  dir: "desc" | "asc",
): number {
  const va = metricValue(a, key);
  const vb = metricValue(b, key);
  const aNull = va == null;
  const bNull = vb == null;
  if (aNull && bNull) return a.id.localeCompare(b.id);
  if (aNull) return 1;
  if (bNull) return -1;
  const diff = va - vb;
  if (diff !== 0) return dir === "desc" ? -diff : diff;
  return a.id.localeCompare(b.id);
}

export function CorpusBrowser({ cards }: { cards: Card[] }) {
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [pattern, setPattern] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const orderedPatterns = useMemo(() => {
    const fromCards = new Set<string>();
    for (const c of cards) for (const t of c.pattern_tags) fromCards.add(t);
    const glossaryIds = PATTERN_GLOSSARY.map((p) => p.id);
    const present = glossaryIds.filter((id) => fromCards.has(id));
    const absent = glossaryIds.filter((id) => !fromCards.has(id));
    const extras = Array.from(fromCards)
      .filter((id) => !glossaryIds.includes(id))
      .sort();
    return [...present, ...extras, ...absent];
  }, [cards]);

  const filtered = useMemo(() => {
    const list = cards.filter((c) => {
      if (platform !== "all" && c.platform !== platform) return false;
      if (pattern !== "all" && !c.pattern_tags.includes(pattern)) return false;
      return true;
    });
    return [...list].sort((a, b) => compareCards(a, b, sortKey, sortDir));
  }, [cards, platform, pattern, sortKey, sortDir]);

  const isEmpty = cards.length === 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4 border border-hairline bg-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
              Sort
            </span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-hairline bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-ink"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="border border-ink bg-ink px-3 py-1.5 text-sm text-paper"
            aria-label={
              sortDir === "desc" ? "Sort descending" : "Sort ascending"
            }
            title={sortDir === "desc" ? "High → low" : "Low → high"}
          >
            {sortDir === "desc" ? "↓ High → low" : "↑ Low → high"}
          </button>
          {sortKey === "engagement" ? (
            <p className="max-w-xs text-[11px] leading-snug text-faint">
              Engagement = views + 10×likes + 20×comments
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
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
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
            Pattern
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={pattern === "all"}
              onClick={() => setPattern("all")}
              label="All"
            />
            {orderedPatterns.map((id) => (
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

      {!isEmpty ? (
        <p className="text-sm text-studio">
          {filtered.length} of {cards.length} cards
        </p>
      ) : null}

      {isEmpty ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="border border-hairline bg-ghost px-4 py-12 text-center text-studio">
          No cards match these filters.
        </div>
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
          ? "rounded-sm border border-ink bg-ink px-2.5 py-1 text-xs text-paper"
          : "rounded-sm border border-hairline bg-transparent px-2.5 py-1 text-xs text-studio hover:border-ink/50"
      }
    >
      {label}
    </button>
  );
}
