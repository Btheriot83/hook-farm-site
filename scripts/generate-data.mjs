#!/usr/bin/env node
/**
 * Build-time export of corpus JSON + llms.txt for agents/CDN.
 * Run via: npm run generate:data (also hooked as prebuild).
 */
import { createRequire } from "module";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cardsDir = join(root, "content", "cards");
const publicData = join(root, "public", "data");
const baseUrl = "https://hook-farm-site.vercel.app";

const CATEGORIES = ["ai", "true_crime", "diesel", "rideshare"];
const PLATFORMS = ["youtube", "tiktok", "instagram", "facebook", "x"];

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function asNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Quote unquoted YAML scalars that break js-yaml (@handles, [Music] hooks, etc.). */
function sanitizeFrontmatterYaml(raw) {
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

function normalizeCategory(value) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return CATEGORIES.includes(raw) ? raw : "ai";
}

function thumbPublicPath(thumbnail_path, thumbnail_url) {
  const path = String(thumbnail_path ?? "").trim();
  if (path) {
    const file = path.replace(/^\/?thumbs\//, "").replace(/^\.\//, "");
    if (file) return `/thumbs/${file}`;
  }
  const url = String(thumbnail_url ?? "").trim();
  return url || null;
}

function normalizeCard(raw, body = "") {
  const id = String(raw.id ?? "").trim();
  if (!id) return null;

  const transcriptFromBody =
    body.replace(/^##\s*Transcript[^\n]*\n+/i, "").trim() || "";

  const thumbnail_path = String(raw.thumbnail_path ?? "");
  const thumbnail_url = String(raw.thumbnail_url ?? "");

  return {
    id,
    category: normalizeCategory(raw.category),
    platform: String(raw.platform ?? "youtube"),
    url: String(raw.url ?? ""),
    title: String(raw.title ?? id),
    creator_handle: String(raw.creator_handle ?? ""),
    hook_onscreen: String(raw.hook_onscreen ?? ""),
    hook_spoken: String(raw.hook_spoken ?? ""),
    niche_tags: asStringArray(raw.niche_tags),
    pattern_tags: asStringArray(raw.pattern_tags),
    views: asNullableNumber(raw.views),
    likes: asNullableNumber(raw.likes),
    comments: asNullableNumber(raw.comments),
    saves: asNullableNumber(raw.saves),
    format: String(raw.format ?? "short"),
    post_date: raw.post_date == null ? null : String(raw.post_date),
    thumb: thumbPublicPath(thumbnail_path, thumbnail_url),
    transcript_30s: String(raw.transcript_30s ?? "") || transcriptFromBody,
  };
}

function loadCards() {
  if (!existsSync(cardsDir)) return [];
  const files = readdirSync(cardsDir).filter(
    (name) =>
      !name.startsWith(".") &&
      !name.endsWith(".disabled") &&
      (name.endsWith(".md") || name.endsWith(".json")),
  );

  const cards = [];
  for (const file of files) {
    const full = join(cardsDir, file);
    try {
      if (file.endsWith(".json")) {
        const raw = JSON.parse(readFileSync(full, "utf8"));
        const card = normalizeCard(raw);
        if (card) cards.push(card);
      } else {
        const raw = sanitizeFrontmatterYaml(readFileSync(full, "utf8"));
        const { data, content } = matter(raw);
        const card = normalizeCard(data, content.trim());
        if (card) cards.push(card);
      }
    } catch {
      // skip malformed
    }
  }

  return cards.sort((a, b) => a.id.localeCompare(b.id));
}

function countMap(cards, key) {
  const map = Object.create(null);
  for (const c of cards) {
    const k = c[key];
    map[k] = (map[k] ?? 0) + 1;
  }
  return map;
}

const cards = loadCards();
const lastUpdated = new Date().toISOString();
const byCategory = Object.fromEntries(
  CATEGORIES.map((c) => [c, cards.filter((x) => x.category === c).length]),
);
const byPlatformRaw = countMap(cards, "platform");
const byPlatform = Object.fromEntries(
  PLATFORMS.filter((p) => byPlatformRaw[p]).map((p) => [p, byPlatformRaw[p]]),
);
for (const [p, n] of Object.entries(byPlatformRaw)) {
  if (!(p in byPlatform)) byPlatform[p] = n;
}

mkdirSync(publicData, { recursive: true });

const index = {
  name: "Hook Farm",
  description:
    "Read-only viral packaging corpus. Collect only — no likes, comments, or follows. Categories: ai, true_crime, diesel, rideshare.",
  baseUrl,
  total: cards.length,
  byCategory,
  byPlatform,
  lastUpdated,
  endpoints: {
    human: {
      home: `${baseUrl}/`,
      agents: `${baseUrl}/agents`,
      patterns: `${baseUrl}/patterns`,
      stats: `${baseUrl}/stats`,
      about: `${baseUrl}/about`,
      card: `${baseUrl}/cards/{id}`,
    },
    machine: {
      llmsTxt: `${baseUrl}/llms.txt`,
      index: `${baseUrl}/data/index.json`,
      cards: `${baseUrl}/data/cards.json`,
      apiCards: `${baseUrl}/api/cards`,
      agentsGuide:
        "https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/AGENTS.md",
      schema:
        "https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/SCHEMA.md",
    },
  },
  disclaimer:
    "Read-only training corpus. Public content only. No affiliation with creators or platforms.",
};

writeJson(join(publicData, "index.json"), index);
writeJson(join(publicData, "cards.json"), cards);

const llms = `# Hook Farm

> Read-only viral packaging corpus for studying hooks, titles, and pattern craft. Collect only — never like, comment, follow, or post.

Base URL: ${baseUrl}
Repo: https://github.com/Btheriot83/hook-farm-site

## For agents (prefer these over HTML scraping)

- Index: ${baseUrl}/data/index.json
- All cards: ${baseUrl}/data/cards.json
- Optional alias: ${baseUrl}/api/cards → 308 to /data/cards.json
- Agent guide: https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/AGENTS.md
- Schema: https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/SCHEMA.md
- This file: ${baseUrl}/llms.txt

## Categories

| category | Use for |
|----------|---------|
| ai | ChatGPT, Claude, Cursor, agents, tools, prompts |
| true_crime | True crime / dark storytelling (prefer faceless) |
| diesel | Mobile diesel repair, semi/heavy truck, fleet roadside |
| rideshare | Uber, Lyft, gig driving packaging |

## Card JSON fields

id, category, platform, url, title, creator_handle, hook_onscreen, hook_spoken, niche_tags, pattern_tags, views, likes, comments, saves, format, post_date, thumb, transcript_30s

## How to use (short)

1. Fetch /data/index.json for totals + byCategory / byPlatform
2. Fetch /data/cards.json and filter by category, niche_tags, pattern_tags
3. Prefer high views relative to format; skip notes containing "weak"
4. Pattern tags are niche-agnostic packaging craft for transfer learning

## Key human routes

- / · /patterns · /stats · /agents · /about · /cards/{id}

## Counts (build-time)

- total: ${cards.length}
- byCategory: ${CATEGORIES.map((c) => `${c}=${byCategory[c]}`).join(", ")}
- lastUpdated: ${lastUpdated}

## Disclaimer

Independent read-only corpus. Public sources only. No endorsement.
`;

writeFileSync(join(root, "public", "llms.txt"), llms, "utf8");

console.log(
  `generate:data → ${cards.length} cards → public/data/index.json, cards.json, llms.txt`,
);
