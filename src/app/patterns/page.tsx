import type { Metadata } from "next";
import Link from "next/link";
import { PATTERN_GLOSSARY, patternLabel } from "@/lib/patterns";
import {
  countByPattern,
  getAllCards,
  getAllPatternTagsFromCards,
} from "@/lib/cards";

export const metadata: Metadata = {
  title: "Patterns",
};

export default function PatternsPage() {
  const cards = getAllCards();
  const counts = countByPattern(cards);
  const fromCards = getAllPatternTagsFromCards();
  const known = new Set(PATTERN_GLOSSARY.map((p) => p.id));
  const extras = fromCards.filter((id) => !known.has(id));

  const glossarySorted = [...PATTERN_GLOSSARY].sort(
    (a, b) =>
      (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) ||
      a.label.localeCompare(b.label),
  );

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="identity-mark" aria-hidden />
          Craft glossary
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Patterns
        </h1>
        <p className="leading-relaxed text-studio">
          Packaging moves used on corpus cards. Each entry is craft vocabulary —
          definition, when it works, when it fails — plus live examples from the
          harvest.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {glossarySorted.map((p) => {
          const n = counts.get(p.id) ?? 0;
          return (
            <li key={p.id}>
              <Link
                href={`/patterns/${encodeURIComponent(p.id)}`}
                className="block h-full border border-hairline bg-card p-5 transition-[border-color] hover:border-ink"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl text-ink">{p.label}</h2>
                  <span className="metric-xl text-lg tabular-nums text-studio">
                    {n}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">
                  {p.id}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-studio">
                  {p.definition}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                  {n === 0 ? "No cards yet" : `${n} card${n === 1 ? "" : "s"} →`}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {extras.length > 0 ? (
        <section className="space-y-3 border-t border-hairline pt-8">
          <h2 className="font-display text-2xl text-ink">Also on cards</h2>
          <p className="text-sm text-faint">
            Tags in the live corpus not yet in the core glossary.
          </p>
          <ul className="flex flex-wrap gap-2">
            {extras.map((id) => (
              <li key={id}>
                <Link
                  href={`/patterns/${encodeURIComponent(id)}`}
                  className="inline-block border border-hairline px-2.5 py-1 font-mono text-xs text-studio hover:border-ink hover:text-ink"
                >
                  {patternLabel(id)}
                  <span className="ml-2 text-faint">{counts.get(id) ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <Link href="/" className="hover:text-ink">
          ← Corpus
        </Link>
      </p>
    </div>
  );
}
