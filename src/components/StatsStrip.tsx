import Link from "next/link";
import type { CorpusStats } from "@/lib/cards";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";

/** Compact ledger strip — keeps thumbs above the fold. */
export function StatsStrip({ stats }: { stats: CorpusStats }) {
  if (stats.total === 0) return null;

  const topPatterns = stats.topPatterns.slice(0, 4);
  const topViews = stats.topByViews[0];

  return (
    <section
      aria-label="Corpus snapshot"
      className="border border-hairline bg-card"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3.5 py-2.5 text-[12px] text-studio sm:px-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          <span className="identity-mark" aria-hidden />
          {stats.total} cards
        </p>

        <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden />

        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {stats.byPlatform.map((p) => (
            <li key={p.platform} className="flex items-center gap-1.5">
              <span className="mark-platform !px-1 !py-0">{p.platform}</span>
              <span className="metric-xl text-sm">{p.count}</span>
            </li>
          ))}
        </ul>

        <span className="hidden h-3 w-px bg-hairline md:block" aria-hidden />

        <ul className="hidden flex-wrap items-center gap-x-3 gap-y-1 md:flex">
          {topPatterns.map((p) => (
            <li key={p.id}>
              <Link
                href={`/patterns/${encodeURIComponent(p.id)}`}
                className="hover:text-ink"
              >
                {patternLabel(p.id)}
                <span className="ml-1 tabular-nums text-faint">{p.count}</span>
              </Link>
            </li>
          ))}
        </ul>

        {topViews ? (
          <>
            <span className="hidden h-3 w-px bg-hairline lg:block" aria-hidden />
            <p className="hidden min-w-0 truncate lg:block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                Top{" "}
              </span>
              <Link
                href={`/cards/${encodeURIComponent(topViews.id)}`}
                className="font-display text-ink hover:underline"
              >
                {topViews.title}
              </Link>
              <span className="ml-2 tabular-nums text-faint">
                {formatCount(topViews.views)}
              </span>
            </p>
          </>
        ) : null}

        <Link
          href="/stats"
          className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-faint hover:text-ink"
        >
          Ledger →
        </Link>
      </div>
    </section>
  );
}
