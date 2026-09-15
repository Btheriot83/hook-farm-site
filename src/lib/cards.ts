import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Card, Category, Platform } from "./types";
import { CATEGORIES } from "./types";
import { engagementRate, engagementScore } from "./thumbs";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CARDS_DIR = path.join(CONTENT_DIR, "cards");

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Quote unquoted YAML scalars that break js-yaml (@handles, [Music] hooks, etc.). */
function sanitizeFrontmatterYaml(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return raw;
  const fm = raw.slice(3, end);
  const rest = raw.slice(end);

  const fixed = fm
    .split("\n")
    .map((line) => {
      const m = line.match(/^(\s*[A-Za-z0-9_]+\s*:\s*)(.*)$/);
      if (!m) return line;
      const [, prefix, valueRaw] = m;
      const value = valueRaw.trimEnd();
      if (!value) return line;
      if (value === "null" || value === "true" || value === "false") return line;
      if (/^-?\d+(\.\d+)?$/.test(value)) return line;
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        return line;
      }
      // Simple flow sequences of barewords: [chatgpt, money, ai]
      if (/^\[[\w.\-]+(?:\s*,\s*[\w.\-]+)*\]$/.test(value)) return line;
      const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `${prefix}"${escaped}"`;
    })
    .join("\n");

  return `---${fixed}${rest}`;
}

function normalizeCategory(value: unknown): Category {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if ((CATEGORIES as string[]).includes(raw)) return raw as Category;
  return "ai";
}


function normalizeCard(raw: Record<string, unknown>, body = ""): Card | null {
  const id = String(raw.id ?? "").trim();
  if (!id) return null;

  const transcriptFromBody =
    body
      .replace(/^##\s*Transcript[^\n]*\n+/i, "")
      .trim() || "";

  return {
    id,
    collected_at: String(raw.collected_at ?? ""),
    platform: String(raw.platform ?? "youtube") as Platform,
    category: normalizeCategory(raw.category),
    url: String(raw.url ?? ""),
    creator_handle: String(raw.creator_handle ?? ""),
    title: String(raw.title ?? id),
    hook_onscreen: String(raw.hook_onscreen ?? ""),
    hook_spoken: String(raw.hook_spoken ?? ""),
    thumbnail_path: String(raw.thumbnail_path ?? ""),
    thumbnail_url: String(raw.thumbnail_url ?? ""),
    transcript_30s: String(raw.transcript_30s ?? "") || transcriptFromBody,
    transcript_path: String(raw.transcript_path ?? ""),
    views: asNullableNumber(raw.views),
    likes: asNullableNumber(raw.likes),
    comments: asNullableNumber(raw.comments),
    saves: asNullableNumber(raw.saves),
    post_date: raw.post_date == null ? null : String(raw.post_date),
    niche_tags: asStringArray(raw.niche_tags),
    pattern_tags: asStringArray(raw.pattern_tags),
    format: String(raw.format ?? "short"),
    notes: String(raw.notes ?? ""),
    body,
  };
}

function parseMarkdownCard(filePath: string): Card | null {
  const raw = sanitizeFrontmatterYaml(fs.readFileSync(filePath, "utf8"));
  const { data, content } = matter(raw);
  return normalizeCard(data as Record<string, unknown>, content.trim());
}

function parseJsonCard(filePath: string): Card | null {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<
    string,
    unknown
  >;
  return normalizeCard(raw);
}

/** Build-time / request memo so SSG does not re-parse every card file per page. */
let cachedCards: Card[] | null = null;
let cachedById: Map<string, Card> | null = null;

/** Load all live cards from content/cards (skips *.disabled and non card files). */
export function getAllCards(): Card[] {
  if (cachedCards) return cachedCards;
  if (!fs.existsSync(CARDS_DIR)) {
    cachedCards = [];
    cachedById = new Map();
    return cachedCards;
  }

  const files = fs
    .readdirSync(CARDS_DIR)
    .filter(
      (name) =>
        !name.startsWith(".") &&
        !name.endsWith(".disabled") &&
        (name.endsWith(".md") || name.endsWith(".json")),
    );

  const cards: Card[] = [];
  for (const file of files) {
    const full = path.join(CARDS_DIR, file);
    try {
      const card = file.endsWith(".json")
        ? parseJsonCard(full)
        : parseMarkdownCard(full);
      if (card) cards.push(card);
    } catch {
      // Skip malformed cards rather than failing the build
    }
  }

  cards.sort((a, b) => {
    const da = a.collected_at || a.post_date || "";
    const db = b.collected_at || b.post_date || "";
    return db.localeCompare(da);
  });

  cachedCards = cards;
  cachedById = new Map(cards.map((c) => [c.id, c]));
  return cachedCards;
}

export function getCardById(id: string): Card | undefined {
  getAllCards();
  return cachedById?.get(id);
}

export function getAllPatternTagsFromCards(): string[] {
  const set = new Set<string>();
  for (const card of getAllCards()) {
    for (const tag of card.pattern_tags) set.add(tag);
  }
  return Array.from(set).sort();
}

export function getCardsByPattern(patternId: string): Card[] {
  return getAllCards().filter((c) => c.pattern_tags.includes(patternId));
}

/** Cards sharing the most pattern_tags with `card`, excluding itself. */
export function getSimilarCards(card: Card, limit = 4): Card[] {
  const tags = new Set(card.pattern_tags);
  if (tags.size === 0) return [];

  const scored = getAllCards()
    .filter((c) => c.id !== card.id)
    .map((c) => {
      let shared = 0;
      for (const t of c.pattern_tags) if (tags.has(t)) shared += 1;
      return { c, shared };
    })
    .filter((x) => x.shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      const va = a.c.views ?? -1;
      const vb = b.c.views ?? -1;
      if (vb !== va) return vb - va;
      return a.c.id.localeCompare(b.c.id);
    });

  return scored.slice(0, limit).map((x) => x.c);
}

export function countByPattern(cards: Card[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const c of cards) {
    for (const t of c.pattern_tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return map;
}

export function countByPlatform(cards: Card[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const c of cards) {
    map.set(c.platform, (map.get(c.platform) ?? 0) + 1);
  }
  return map;
}

export interface CorpusStats {
  total: number;
  byPlatform: { platform: string; count: number }[];
  byCategory: { category: Category; count: number }[];
  topPatterns: { id: string; count: number }[];
  topByViews: Card[];
}

export function getCorpusStats(cards?: Card[]): CorpusStats {
  const list = cards ?? getAllCards();
  const byPlatform = Array.from(countByPlatform(list).entries())
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count || a.platform.localeCompare(b.platform));

  const topPatterns = Array.from(countByPattern(list).entries())
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));

  const topByViews = [...list]
    .filter((c) => c.views != null)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || a.id.localeCompare(b.id))
    .slice(0, 8);

  const categoryMap = new Map<Category, number>();
  for (const c of list) {
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1);
  }
  const byCategory = CATEGORIES.map((category) => ({
    category,
    count: categoryMap.get(category) ?? 0,
  })).filter((row) => row.count > 0);

  return { total: list.length, byPlatform, byCategory, topPatterns, topByViews };
}

export { engagementRate, engagementScore };
