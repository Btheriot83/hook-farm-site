import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCards, getCardById } from "@/lib/cards";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllCards().map((card) => ({ id: card.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = getCardById(decodeURIComponent(id));
  if (!card) return { title: "Card not found" };
  return { title: card.title };
}

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const card = getCardById(decodeURIComponent(id));
  if (!card) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <p className="text-sm text-ink/45">
        <Link href="/" className="hover:text-accent">
          ← Corpus
        </Link>
      </p>

      <header className="space-y-4 border-b border-ink/10 pb-8">
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-ink/50">
          <span>{card.platform}</span>
          <span>{card.format}</span>
          {card.post_date ? <span>{card.post_date}</span> : null}
        </div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
          {card.title}
        </h1>
        <p className="text-ink/60">{card.creator_handle}</p>
        {card.url ? (
          <p>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Open original ↗
            </a>
          </p>
        ) : null}
      </header>

      {(card.hook_onscreen || card.hook_spoken) && (
        <section className="space-y-3 rounded-sm border border-ink/15 bg-paper-shade/40 p-5">
          <h2 className="font-display text-xl text-ink">Hook</h2>
          {card.hook_onscreen ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/45">
                On-screen
              </p>
              <p className="mt-1 text-lg italic text-ink">
                “{card.hook_onscreen}”
              </p>
            </div>
          ) : null}
          {card.hook_spoken ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/45">
                Spoken
              </p>
              <p className="mt-1 text-ink/80">“{card.hook_spoken}”</p>
            </div>
          ) : null}
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-4">
        <Stat label="Views" value={formatCount(card.views)} />
        <Stat label="Likes" value={formatCount(card.likes)} />
        <Stat label="Comments" value={formatCount(card.comments)} />
        <Stat label="Saves" value={formatCount(card.saves)} />
      </section>

      {card.pattern_tags.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">Patterns</h2>
          <ul className="flex flex-wrap gap-2">
            {card.pattern_tags.map((tag) => (
              <li key={tag}>
                <Link
                  href="/patterns"
                  className="rounded-sm border border-ink/15 px-2.5 py-1 text-sm text-ink/75 hover:border-accent hover:text-accent"
                >
                  {patternLabel(tag)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {card.niche_tags.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">Niche</h2>
          <ul className="flex flex-wrap gap-2">
            {card.niche_tags.map((tag) => (
              <li
                key={tag}
                className="rounded-sm bg-ink/5 px-2 py-1 text-sm text-ink/65"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {card.transcript_30s ? (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">
            Transcript (~30s)
          </h2>
          <pre className="whitespace-pre-wrap rounded-sm border border-ink/10 bg-paper-shade/50 p-4 font-mono text-sm leading-relaxed text-ink/80">
            {card.transcript_30s}
          </pre>
        </section>
      ) : null}

      {card.notes ? (
        <section className="space-y-2">
          <h2 className="font-display text-xl text-ink">Notes</h2>
          <p className="text-ink/70">{card.notes}</p>
        </section>
      ) : null}

      <p className="text-xs text-ink/40">
        Collected {card.collected_at || "—"} · id{" "}
        <code className="font-mono">{card.id}</code>
      </p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 px-3 py-3">
      <p className="text-xs uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-1 font-display text-xl text-ink">{value}</p>
    </div>
  );
}
