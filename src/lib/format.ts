export function formatCount(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** likes/views as a percentage string, or null when either metric is missing. */
export function formatEngagementRate(
  likes: number | null | undefined,
  views: number | null | undefined,
): string | null {
  if (likes == null || views == null || views <= 0) return null;
  const pct = (likes / views) * 100;
  if (!Number.isFinite(pct)) return null;
  if (pct >= 10) return `${pct.toFixed(1)}%`;
  if (pct >= 1) return `${pct.toFixed(2)}%`;
  return `${pct.toFixed(3)}%`;
}

export function formatDateLabel(raw: string | null | undefined): string {
  if (!raw) return "—";
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return raw;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Phoenix",
  }).format(t);
}
