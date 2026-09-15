import type { Metadata } from "next";
import Link from "next/link";
import { PATTERN_GLOSSARY } from "@/lib/patterns";
import { getAllPatternTagsFromCards } from "@/lib/cards";

export const metadata: Metadata = {
  title: "Patterns",
};

export default function PatternsPage() {
  const fromCards = getAllPatternTagsFromCards();
  const known = new Set(PATTERN_GLOSSARY.map((p) => p.id));
  const extras = fromCards.filter((id) => !known.has(id));

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <h1 className="font-display text-4xl tracking-tight text-ink">
          Patterns
        </h1>
        <p className="leading-relaxed text-ink/65">
          Packaging craft tags used on corpus cards. Definitions stay available
          even while the harvest is still empty — so you can learn the vocabulary
          before winners land.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {PATTERN_GLOSSARY.map((p) => (
          <li
            key={p.id}
            className="border border-ink/15 bg-paper-shade/30 p-5"
          >
            <h2 className="font-display text-xl text-ink">{p.label}</h2>
            <p className="mt-1 font-mono text-xs text-accent">{p.id}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {p.definition}
            </p>
          </li>
        ))}
      </ul>

      {extras.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-ink">Also seen on cards</h2>
          <p className="text-sm text-ink/55">
            Tags present in the live corpus that are not yet in the core glossary.
          </p>
          <ul className="flex flex-wrap gap-2">
            {extras.map((id) => (
              <li
                key={id}
                className="rounded-sm border border-ink/15 px-2 py-1 font-mono text-xs text-ink/70"
              >
                {id}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-sm text-ink/45">
        <Link href="/" className="text-accent hover:underline">
          ← Back to corpus
        </Link>
      </p>
    </div>
  );
}
