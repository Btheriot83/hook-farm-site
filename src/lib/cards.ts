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

