import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";
import { cardThumbSrc } from "@/lib/thumbs";

export function CardTile({ card }: { card: Card }) {
  const thumb = cardThumbSrc(card);
  const tags = card.pattern_tags.slice(0, 3);

  return (
    <Link
      href={`/cards/${encodeURIComponent(card.id)}`}
      className="group flex flex-col overflow-hidden border border-hairline bg-card transition-colors hover:border-ink/40"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ghost">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized={thumb.startsWith("/thumbs/")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-faint">
            No thumb
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <h2 className="line-clamp-2 font-display text-[1.05rem] leading-snug text-ink">
          {card.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2 text-xs text-studio">
          <span className="truncate">{card.creator_handle || "—"}</span>
          <span
            className="rounded-sm border border-hairline px-1.5 py-0.5 uppercase tracking-wide text-[10px] text-studio"
          >
            {card.platform}
          </span>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-ghost px-1.5 py-0.5 text-[11px] text-studio"
              >
                {patternLabel(tag)}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-hairline pt-2.5 text-[11px] tabular-nums text-faint">
          <span>{formatCount(card.views)} views</span>
          <span>{formatCount(card.likes)} likes</span>
          <span>{formatCount(card.comments)} comments</span>
          {card.saves != null ? (
            <span>{formatCount(card.saves)} saves</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
