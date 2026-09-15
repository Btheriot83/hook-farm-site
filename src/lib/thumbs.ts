import type { Card } from "./types";

/** Prefer local content thumb served from /thumbs; fall back to remote URL. */
export function cardThumbSrc(card: Card): string | null {
  const path = card.thumbnail_path?.trim();
  if (path) {
    const file = path.replace(/^\/?thumbs\//, "").replace(/^\.\//, "");
    if (file) return `/thumbs/${file}`;
  }
  const url = card.thumbnail_url?.trim();
  return url || null;
}

export function engagementScore(card: Card): number | null {
  const { views, likes, comments } = card;
  if (views == null && likes == null && comments == null) return null;
  return (views ?? 0) + 10 * (likes ?? 0) + 20 * (comments ?? 0);
}
