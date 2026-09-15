import { getAllCards } from "@/lib/cards";
import { CorpusBrowser } from "@/components/CorpusBrowser";

export default function HomePage() {
  const cards = getAllCards();

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Corpus
        </h1>
        <p className="text-base leading-relaxed text-ink/65">
          Packaging patterns from public winners Hook Farm has collected.
          Browse by platform and craft tag — display only, never engagement.
        </p>
        <p className="text-sm text-ink/45">
          {cards.length === 0
            ? "0 cards indexed"
            : `${cards.length} card${cards.length === 1 ? "" : "s"} indexed`}
        </p>
      </header>

      <CorpusBrowser cards={cards} />
    </div>
  );
}
