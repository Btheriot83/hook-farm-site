import { getAllCards, getCorpusStats } from "@/lib/cards";
import { CorpusBrowser } from "@/components/CorpusBrowser";
import { StatsStrip } from "@/components/StatsStrip";

export default function HomePage() {
  const cards = getAllCards();
  const stats = getCorpusStats(cards);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
        <div className="max-w-xl space-y-1.5">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
            <span className="identity-mark" aria-hidden />
            Studio catalog
          </p>
          <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Corpus
          </h1>
        </div>
        <p className="max-w-sm text-[13px] leading-snug text-studio">
          Packaging winners. Filter · sort · study. Display only — never
          engagement.
        </p>
      </header>

      <StatsStrip stats={stats} />

      <CorpusBrowser cards={cards} />
    </div>
  );
}
