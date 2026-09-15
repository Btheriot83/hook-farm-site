import Link from "next/link";
import type { Card } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";

export function CardTile({ card }: { card: Card }) {
  return (
    <Link
      href={`/cards/${encodeURIComponent(card.id)}`}
      className="group flex flex-col border border-ink/15 bg-paper-shade/40 p-4 transition-colors hover:border-accent/60 hover:bg-paper-shade"
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-ink/50">
        <span>{card.platform}</span>
        <span>{card.format}</span>
      </div>
      <h2 className="font-display text-lg leading-snug text-ink group-hover:text-accent">
        {card.title}
      </h2>
      {card.hook_onscreen ? (
        <p className="mt-2 line-clamp-2 text-sm italic text-ink/60">
          “{card.hook_onscreen}”
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {card.pattern_tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-sm bg-ink/5 px-1.5 py-0.5 text-[11px] text-ink/70"
          >
            {patternLabel(tag)}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink/45">
        <span>{card.creator_handle || "—"}</span>
        <span>{formatCount(card.views)} views</span>
      </div>
    </Link>
  );
}
