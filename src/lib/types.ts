export type Platform = "youtube" | "tiktok" | "instagram" | "facebook" | "x";
export type Format = "short" | "long" | "text" | "carousel";

export interface Card {
  id: string;
  collected_at: string;
  platform: Platform;
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
