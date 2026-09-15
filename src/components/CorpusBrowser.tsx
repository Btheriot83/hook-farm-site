"use client";

import { useMemo, useState } from "react";
import type { Card, Category, Platform } from "@/lib/types";
import { CATEGORIES, PLATFORMS, categoryLabel } from "@/lib/types";
import { PATTERN_GLOSSARY, patternLabel } from "@/lib/patterns";
import { engagementRate, engagementScore } from "@/lib/thumbs";
import { CardTile } from "./CardTile";
import { EmptyState } from "./EmptyState";

type SortKey =
  | "views"
  | "likes"
  | "comments"
  | "saves"
  | "collected"
  | "post_date"
  | "engagement"
  | "engagement_rate";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "views", label: "Views" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "saves", label: "Saves" },
  { key: "collected", label: "Newest collected" },
  { key: "post_date", label: "Newest post date" },
  { key: "engagement", label: "Engagement score" },
  { key: "engagement_rate", label: "Engagement rate" },
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
    case "engagement_rate":
      return engagementRate(card);
  }
}

/** Secondary tie-break: views desc → likes desc → id. Nulls sink. */
function tieBreak(a: Card, b: Card): number {
  const va = a.views;
  const vb = b.views;
  if (va != null || vb != null) {
    if (va == null) return 1;
    if (vb == null) return -1;
    if (vb !== va) return vb - va;
  }
  const la = a.likes;
  const lb = b.likes;
  if (la != null || lb != null) {
    if (la == null) return 1;
    if (lb == null) return -1;
    if (lb !== la) return lb - la;
  }
  return a.id.localeCompare(b.id);
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
  if (aNull && bNull) return tieBreak(a, b);
  if (aNull) return 1;
  if (bNull) return -1;
  const diff = va - vb;
  if (diff !== 0) return dir === "desc" ? -diff : diff;
  return tieBreak(a, b);
}

export function CorpusBrowser({ cards }: { cards: Card[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [pattern, setPattern] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [query, setQuery] = useState("");
  const [dense, setDense] = useState(true);

  const patternCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of cards) {
      for (const t of c.pattern_tags) map.set(t, (map.get(t) ?? 0) + 1);
    }
    return map;
  }, [cards]);

  const platformCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of cards) map.set(c.platform, (map.get(c.platform) ?? 0) + 1);
    return map;
  }, [cards]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of cards) map.set(c.category, (map.get(c.category) ?? 0) + 1);
    return map;
  }, [cards]);

  const orderedPatterns = useMemo(() => {
    const fromCards = new Set(patternCounts.keys());
    const glossaryIds = PATTERN_GLOSSARY.map((p) => p.id);
    const present = glossaryIds
      .filter((id) => fromCards.has(id))
      .sort(
        (a, b) =>
          (patternCounts.get(b) ?? 0) - (patternCounts.get(a) ?? 0) ||
          a.localeCompare(b),
      );
    const absent = glossaryIds.filter((id) => !fromCards.has(id));
    const extras = Array.from(fromCards)
      .filter((id) => !glossaryIds.includes(id))
      .sort(
        (a, b) =>
          (patternCounts.get(b) ?? 0) - (patternCounts.get(a) ?? 0) ||
          a.localeCompare(b),
      );
    return [...present, ...extras, ...absent];
  }, [patternCounts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = cards.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (platform !== "all" && c.platform !== platform) return false;
      if (pattern !== "all" && !c.pattern_tags.includes(pattern)) return false;
      if (q) {
        const hay = `${c.title} ${c.hook_onscreen} ${c.hook_spoken} ${c.creator_handle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => compareCards(a, b, sortKey, sortDir));
  }, [cards, category, platform, pattern, sortKey, sortDir, query]);

  const isEmpty = cards.length === 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3 border border-hairline bg-card p-3 sm:p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
              Search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, hook, or creator…"
              className="w-full border border-hairline bg-paper px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
            />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
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
            <button
              type="button"
              onClick={() => setDense((d) => !d)}
              className="border border-hairline bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-studio hover:border-ink hover:text-ink"
              aria-pressed={dense}
              title="Toggle grid density"
            >
              {dense ? "Dense" : "Open"}
            </button>
          </div>
        </div>

        {sortKey === "engagement" ? (
          <p className="font-mono text-[10px] leading-snug tracking-wide text-faint">
            Score = views + 10×likes + 20×comments · ties → views → likes → id
          </p>
        ) : null}
        {sortKey === "engagement_rate" ? (
          <p className="font-mono text-[10px] leading-snug tracking-wide text-faint">
            Rate = likes ÷ views (null if either missing) · ties → views → likes
            → id
          </p>
        ) : null}

        <div>
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={category === "all"}
              onClick={() => setCategory("all")}
              label={`All (${cards.length})`}
            />
            {CATEGORIES.map((cat) => {
              const n = categoryCounts.get(cat) ?? 0;
              return (
                <FilterChip
                  key={cat}
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                  label={`${categoryLabel(cat)}${n ? ` (${n})` : ""}`}
                  muted={n === 0}
                />
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
            Platform
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={platform === "all"}
              onClick={() => setPlatform("all")}
              label={`All (${cards.length})`}
            />
            {PLATFORMS.map((p) => {
              const n = platformCounts.get(p) ?? 0;
              return (
                <FilterChip
                  key={p}
                  active={platform === p}
                  onClick={() => setPlatform(p)}
                  label={`${p}${n ? ` (${n})` : ""}`}
                  muted={n === 0}
                />
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
            Pattern
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={pattern === "all"}
              onClick={() => setPattern("all")}
              label="All"
            />
            {orderedPatterns.map((id) => {
              const n = patternCounts.get(id) ?? 0;
              return (
                <FilterChip
                  key={id}
                  active={pattern === id}
                  onClick={() => setPattern(id)}
                  label={`${patternLabel(id)}${n ? ` (${n})` : ""}`}
                  muted={n === 0}
                />
              );
            })}
          </div>
        </div>
      </div>

      {!isEmpty ? (
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-studio">
            {filtered.length}
            <span className="text-faint"> / {cards.length} cards</span>
            {query.trim() ? (
              <span className="normal-case tracking-normal text-faint">
                {" "}
                · “{query.trim()}”
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="border border-hairline bg-ghost px-4 py-14 text-center">
          <p className="font-display text-xl text-ink">No matches</p>
          <p className="mt-2 text-sm text-studio">
            Clear search or loosen category / platform / pattern filters.
          </p>
        </div>
      ) : (
        <div
          className={
            dense
              ? "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {filtered.map((card) => (
            <CardTile key={card.id} card={card} dense={dense} />
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
  muted = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-none border border-ink bg-ink px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-paper"
          : muted
            ? "rounded-none border border-hairline bg-transparent px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-faint"
            : "rounded-none border border-hairline bg-transparent px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-studio hover:border-ink hover:text-ink"
      }
    >
      {label}
    </button>
  );
}
