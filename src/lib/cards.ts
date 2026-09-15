import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Card, Platform } from "./types";

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
  const raw = fs.readFileSync(filePath, "utf8");
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

/** Load all live cards from content/cards (skips *.disabled and non card files). */
export function getAllCards(): Card[] {
  if (!fs.existsSync(CARDS_DIR)) return [];

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

  return cards.sort((a, b) => {
    const da = a.collected_at || a.post_date || "";
    const db = b.collected_at || b.post_date || "";
    return db.localeCompare(da);
  });
}

export function getCardById(id: string): Card | undefined {
  return getAllCards().find((c) => c.id === id);
}

export function getAllPatternTagsFromCards(): string[] {
  const set = new Set<string>();
  for (const card of getAllCards()) {
    for (const tag of card.pattern_tags) set.add(tag);
  }
  return Array.from(set).sort();
}

