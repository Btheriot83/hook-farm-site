import type { Metadata } from "next";
import Link from "next/link";
import { getAllCards, getCorpusStats } from "@/lib/cards";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";
import { categoryLabel } from "@/lib/types";

export const metadata: Metadata = {
  title: "Stats",
};

export default function StatsPage() {
  const cards = getAllCards();
  const stats = getCorpusStats(cards);

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="identity-mark" aria-hidden />
          Ledger
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Stats
        </h1>
        <p className="leading-relaxed text-studio">
          Counts from the live corpus only. Missing metrics stay blank — nothing
          invented.
        </p>
      </header>

      <section className="border border-hairline bg-card">
        <div className="border-b border-hairline px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            Cards · {stats.total}
          </p>
        </div>
        <div className="grid sm:grid-cols-3">
          <div className="border-b border-hairline px-4 py-5 sm:border-b-0 sm:border-r">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              By category
            </h2>
            <ul className="mt-4 space-y-2">
              {stats.byCategory.map((c) => (
                <li
                  key={c.category}
                  className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2 last:border-0"
                >
                  <span className="mark-platform">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="metric-xl text-2xl">{c.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-b border-hairline px-4 py-5 sm:border-b-0 sm:border-r">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              By platform
            </h2>
            {stats.byPlatform.length === 0 ? (
              <p className="mt-4 text-sm text-faint">No cards yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {stats.byPlatform.map((p) => (
                  <li
                    key={p.platform}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2 last:border-0"
                  >
                    <span className="mark-platform">{p.platform}</span>
                    <span className="metric-xl text-2xl">{p.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-4 py-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              Top patterns by card count
            </h2>
            {stats.topPatterns.length === 0 ? (
              <p className="mt-4 text-sm text-faint">No patterns yet.</p>
            ) : (
              <ol className="mt-4 space-y-2">
                {stats.topPatterns.map((p, i) => (
                  <li
                    key={p.id}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2 last:border-0"
                  >
                    <Link
                      href={`/patterns/${encodeURIComponent(p.id)}`}
                      className="text-sm text-studio hover:text-ink"
                    >
                      <span className="mr-2 font-mono text-[10px] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {patternLabel(p.id)}
                    </Link>
                    <span className="metric-xl text-xl">{p.count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Top cards by views
        </h2>
        {stats.topByViews.length === 0 ? (
          <p className="border border-hairline bg-ghost px-4 py-10 text-center text-sm text-studio">
            No view metrics yet.
          </p>
        ) : (
          <ol className="border border-hairline bg-card">
            {stats.topByViews.map((c, i) => (
              <li
                key={c.id}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-4 py-3.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <span className="mr-3 font-mono text-[10px] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/cards/${encodeURIComponent(c.id)}`}
                    className="font-display text-lg text-ink hover:underline"
                  >
                    {c.title}
                  </Link>
                  <p className="mt-0.5 pl-7 text-xs text-studio">
                    {c.creator_handle} · {categoryLabel(c.category)} · {c.platform}
                  </p>
                </div>
                <span className="metric-xl text-2xl">
                  {formatCount(c.views)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <Link href="/" className="hover:text-ink">
          ← Corpus
        </Link>
      </p>
    </div>
  );
}
