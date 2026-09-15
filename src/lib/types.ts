export type Platform = "youtube" | "tiktok" | "instagram" | "facebook" | "x";
export type Format = "short" | "long" | "text" | "carousel";
export type Category = "ai" | "true_crime" | "diesel" | "rideshare";

export interface Card {
  id: string;
  collected_at: string;
  platform: Platform;
  category: Category;
  url: string;
  creator_handle: string;
  title: string;
  hook_onscreen: string;
  hook_spoken: string;
  thumbnail_path: string;
  thumbnail_url: string;
  transcript_30s: string;
  transcript_path: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  post_date: string | null;
  niche_tags: string[];
  pattern_tags: string[];
  format: Format | string;
  notes: string;
  /** Markdown body below frontmatter (transcript section, etc.) */
  body?: string;
}

export const PLATFORMS: Platform[] = [
  "youtube",
  "tiktok",
  "instagram",
  "facebook",
  "x",
];

export const CATEGORIES: Category[] = [
  "ai",
  "true_crime",
  "diesel",
  "rideshare",
];

/** Quiet display labels for category chips / marks. */
export function categoryLabel(category: Category | string): string {
  switch (category) {
    case "ai":
      return "AI";
    case "true_crime":
      return "True crime";
    case "diesel":
      return "Diesel";
    case "rideshare":
      return "Rideshare";
    default:
      return String(category);
  }
}
