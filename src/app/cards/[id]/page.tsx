import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCards,
  getCardById,
  getSimilarCards,
} from "@/lib/cards";
import {
  formatCount,
  formatDateLabel,
  formatEngagementRate,
} from "@/lib/format";
import {
  getPatternDef,
  patternDefinition,
  patternLabel,
} from "@/lib/patterns";
import { cardThumbSrc } from "@/lib/thumbs";
import { CardTile } from "@/components/CardTile";

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
  const er = formatEngagementRate(card.likes, card.views);
  const similar = getSimilarCards(card, 4);
  const hasHook = Boolean(card.hook_onscreen || card.hook_spoken);

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        <Link href="/" className="hover:text-ink">
          ← Corpus
        </Link>
      </p>

      {thumb ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-ink/20 bg-ghost">
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

      {/* Metrics as ink weight — immediately under thumb */}
      <section
        aria-label="Metrics"
        className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-5"
      >
        <MetricCell label="Views" value={formatCount(card.views)} />
        <MetricCell label="Likes" value={formatCount(card.likes)} />
        <MetricCell label="Comments" value={formatCount(card.comments)} />
        <MetricCell label="Saves" value={formatCount(card.saves)} />
        <MetricCell label="ER" value={er ?? "—"} hint="likes ÷ views" />
      </section>

      <header className="space-y-3 border-b border-hairline pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mark-platform">{card.platform}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {card.format}
          </span>
          {card.post_date ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              posted {formatDateLabel(card.post_date)}
            </span>
          ) : null}
        </div>
        <h1 className="font-display text-[2rem] leading-[1.15] tracking-tight text-ink sm:text-[2.55rem]">
          {card.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-base text-studio">{card.creator_handle}</p>
          {card.url ? (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-ink bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper hover:bg-transparent hover:text-ink"
            >
              Open original ↗
            </a>
          ) : null}
        </div>
      </header>

      {hasHook ? (
        <section className="space-y-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Hook
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-l-2 border-ink pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                On-screen
              </p>
              {card.hook_onscreen ? (
                <p className="pull-quote mt-2">“{card.hook_onscreen}”</p>
              ) : (
                <p className="mt-2 text-sm text-faint">— none captured</p>
              )}
            </div>
            <div className="border-l border-hairline pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                Spoken
              </p>
              {card.hook_spoken ? (
                <p className="mt-2 font-display text-xl leading-snug text-studio">
                  “{card.hook_spoken}”
                </p>
              ) : (
                <p className="mt-2 text-sm text-faint">— none captured</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {card.pattern_tags.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Patterns — craft notes
          </h2>
          <ul className="space-y-4">
            {card.pattern_tags.map((tag) => {
              const def = getPatternDef(tag);
              return (
                <li
                  key={tag}
                  className="border border-hairline bg-card px-4 py-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={`/patterns/${encodeURIComponent(tag)}`}
                      className="font-display text-xl text-ink hover:underline"
                    >
                      {patternLabel(tag)}
                    </Link>
                    <span className="font-mono text-[10px] text-faint">
                      {tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-studio">
                    {patternDefinition(tag)}
                  </p>
                  {def ? (
                    <p className="mt-2 text-xs leading-relaxed text-faint">
                      Works when {def.whenWorks.charAt(0).toLowerCase()}
                      {def.whenWorks.slice(1)}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {card.niche_tags.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Niche
          </h2>
          <ul className="flex flex-wrap gap-2">
            {card.niche_tags.map((tag) => (
              <li
                key={tag}
                className="border border-hairline px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-studio"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {card.transcript_30s ? (
        <section className="space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Transcript · first ~30s
          </h2>
          <div className="border border-hairline bg-card px-5 py-5 sm:px-6">
            <p className="whitespace-pre-wrap font-display text-[1.05rem] leading-[1.65] text-ink">
              {card.transcript_30s}
            </p>
          </div>
        </section>
      ) : null}

      {card.notes ? (
        <section className="space-y-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Harvest notes
          </h2>
          <p className="text-studio">{card.notes}</p>
        </section>
      ) : null}

      <dl className="grid gap-3 border-t border-hairline pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-faint sm:grid-cols-2">
        <div>
          <dt className="text-faint">Collected</dt>
          <dd className="mt-1 normal-case tracking-normal text-studio">
            {formatDateLabel(card.collected_at)}
          </dd>
        </div>
        <div>
          <dt className="text-faint">Post date</dt>
          <dd className="mt-1 normal-case tracking-normal text-studio">
            {formatDateLabel(card.post_date)}
          </dd>
        </div>
        <div>
          <dt className="text-faint">Platform · format</dt>
          <dd className="mt-1 normal-case tracking-normal text-studio">
            {card.platform} · {card.format}
          </dd>
        </div>
        <div>
          <dt className="text-faint">Id</dt>
          <dd className="mt-1 break-all normal-case tracking-normal text-studio">
            {card.id}
          </dd>
        </div>
      </dl>

      {similar.length > 0 ? (
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Similar · shared patterns
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {similar.map((c) => (
              <CardTile key={c.id} card={c} dense />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function MetricCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-card px-3 py-3.5" title={hint}>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
        {label}
      </p>
      <p className="metric-xl mt-1 text-[1.75rem] leading-none sm:text-[1.85rem]">
        {value}
      </p>
    </div>
  );
}
