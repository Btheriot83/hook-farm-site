import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCards, getCardById } from "@/lib/cards";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";
import { cardThumbSrc } from "@/lib/thumbs";

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

  const thumb = cardThumbSrc(card);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <p className="text-xs uppercase tracking-wider text-faint">
        <Link href="/" className="hover:text-ink">
          ← Corpus
        </Link>
      </p>

      {thumb ? (
        <div className="relative aspect-video w-full overflow-hidden border border-hairline bg-ghost">
          <Image
            src={thumb}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            unoptimized={thumb.startsWith("/thumbs/")}
          />
        </div>
      ) : null}

      <header className="space-y-3 border-b border-hairline pb-8">
        <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wider text-faint">
          <span>{card.platform}</span>
          <span>{card.format}</span>
          {card.post_date ? <span>{card.post_date}</span> : null}
        </div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
          {card.title}
        </h1>
        <p className="text-studio">{card.creator_handle}</p>
        {card.url ? (
          <p>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-ink px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
            >
              Open original ↗
            </a>
          </p>
        ) : null}
      </header>

      {(card.hook_onscreen || card.hook_spoken) && (
        <section className="space-y-3 border border-hairline bg-card p-5">
          <h2 className="font-display text-xl text-ink">Hook</h2>
          {card.hook_onscreen ? (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-faint">
                On-screen
              </p>
              <p className="mt-1 text-lg italic text-ink">
                “{card.hook_onscreen}”
              </p>
            </div>
          ) : null}
          {card.hook_spoken ? (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-faint">
                Spoken
              </p>
              <p className="mt-1 text-studio">“{card.hook_spoken}”</p>
            </div>
          ) : null}
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-4">
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
                  className="rounded-sm border border-hairline px-2.5 py-1 text-sm text-studio hover:border-ink hover:text-ink"
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
                className="rounded-sm bg-ghost px-2 py-1 text-sm text-studio"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {card.transcript_30s ? (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">Transcript (~30s)</h2>
          <pre className="whitespace-pre-wrap border border-hairline bg-ghost p-4 font-mono text-sm leading-relaxed text-ink">
            {card.transcript_30s}
          </pre>
        </section>
      ) : null}

      {card.notes ? (
        <section className="space-y-2">
          <h2 className="font-display text-xl text-ink">Notes</h2>
          <p className="text-studio">{card.notes}</p>
        </section>
      ) : null}

      <p className="text-xs text-faint">
        Collected {card.collected_at || "—"} · id{" "}
        <code className="font-mono">{card.id}</code>
      </p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-hairline bg-card px-3 py-3">
      <p className="text-[11px] uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-1 font-display text-xl tabular-nums text-ink">{value}</p>
    </div>
  );
}
