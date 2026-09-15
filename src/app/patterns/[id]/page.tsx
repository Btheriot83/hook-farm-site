import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardsByPattern, getAllCards, countByPattern } from "@/lib/cards";
import {
  PATTERN_GLOSSARY,
  getPatternDef,
  patternDefinition,
  patternLabel,
} from "@/lib/patterns";
import { CardTile } from "@/components/CardTile";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const fromGlossary = PATTERN_GLOSSARY.map((p) => p.id);
  const fromCards = Array.from(countByPattern(getAllCards()).keys());
  const ids = Array.from(new Set([...fromGlossary, ...fromCards]));
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  return { title: patternLabel(decoded) };
}

export default async function PatternDetailPage({ params }: PageProps) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const def = getPatternDef(id);
  const examples = getCardsByPattern(id)
    .slice()
    .sort((a, b) => (b.views ?? -1) - (a.views ?? -1))
    .slice(0, 5);

  // Unknown tag with zero cards → 404
  if (!def && examples.length === 0) notFound();

  const combine = def?.combineWith ?? [];

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        <Link href="/patterns" className="hover:text-ink">
          ← Patterns
        </Link>
      </p>

      <header className="space-y-3 border-b border-hairline pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          Pattern · {id}
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {patternLabel(id)}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-studio">
          {patternDefinition(id)}
        </p>
      </header>

      {def ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="border border-hairline bg-card p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              When it works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink">{def.whenWorks}</p>
          </section>
          <section className="border border-hairline bg-card p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              When it fails
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink">{def.whenFails}</p>
          </section>
        </div>
      ) : null}

      {combine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Combine with
          </h2>
          <ul className="flex flex-wrap gap-2">
            {combine.map((cid) => (
              <li key={cid}>
                <Link
                  href={`/patterns/${encodeURIComponent(cid)}`}
                  className="inline-block border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-studio hover:border-ink hover:text-ink"
                >
                  {patternLabel(cid)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Examples from corpus
          </h2>
          <span className="metric-xl text-lg">{examples.length}</span>
        </div>
        {examples.length === 0 ? (
          <p className="border border-hairline bg-ghost px-4 py-10 text-center text-sm text-studio">
            No cards tagged {patternLabel(id)} yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {examples.map((c) => (
              <CardTile key={c.id} card={c} dense />
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
