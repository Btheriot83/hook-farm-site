import { getAllCards } from "@/lib/cards";
import { CorpusBrowser } from "@/components/CorpusBrowser";

export default function HomePage() {
  const cards = getAllCards();

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Studio catalog
        </p>
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Corpus
        </h1>
        <p className="text-sm leading-relaxed text-studio">
          Packaging artifacts from public winners. Filter by platform and
          pattern; sort by metrics. Display only — never engagement.
        </p>
      </header>

      <CorpusBrowser cards={cards} />
    </div>
  );
}
