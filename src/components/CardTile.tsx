import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/lib/types";
import { categoryLabel } from "@/lib/types";
import { formatCount, formatEngagementRate } from "@/lib/format";
import { patternLabel } from "@/lib/patterns";
import { cardThumbSrc } from "@/lib/thumbs";

export function CardTile({
  card,
  dense = false,
}: {
  card: Card;
  dense?: boolean;
}) {
  const thumb = cardThumbSrc(card);
  const tags = card.pattern_tags.slice(0, dense ? 2 : 3);
  const er = formatEngagementRate(card.likes, card.views);
  const hookSnippet =
    card.hook_onscreen?.trim() ||
    card.hook_spoken?.trim() ||
    "";

  return (
    <Link
      href={`/cards/${encodeURIComponent(card.id)}`}
      className="group flex flex-col overflow-hidden border border-hairline bg-card transition-[border-color] hover:border-ink"
    >
      {/* Thumb = only color on the desk */}
      <div
        className={
          dense
            ? "relative aspect-[4/3] w-full overflow-hidden border-b border-hairline bg-ghost"
            : "relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-ghost"
        }
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes={
              dense
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover"
            unoptimized={thumb.startsWith("/thumbs/")}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            No thumb
          </div>
        )}
      </div>

      <div
        className={
          dense
            ? "flex flex-1 flex-col gap-2 p-2.5"
            : "flex flex-1 flex-col gap-2.5 p-3.5"
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mark-platform">{card.platform}</span>
            <span className="mark-platform">{categoryLabel(card.category)}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
            {card.format}
          </span>
        </div>

        <h2
          className={
            dense
              ? "line-clamp-2 font-display text-[0.98rem] leading-[1.25] text-ink"
              : "line-clamp-2 font-display text-[1.12rem] leading-[1.25] text-ink"
          }
        >
          {card.title}
        </h2>

        <p className="truncate text-xs text-studio">
          {card.creator_handle || "—"}
        </p>

        {!dense && hookSnippet ? (
          <p className="line-clamp-2 border-l border-hairline pl-2.5 font-display text-[13px] italic leading-snug text-studio">
            {hookSnippet}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wide text-faint"
              >
                {patternLabel(tag)}
                <span className="text-hairline"> ·</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-3 gap-1 border-t border-hairline pt-2.5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              Views
            </p>
            <p className="metric-xl text-lg leading-none">{formatCount(card.views)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              Likes
            </p>
            <p className="metric-xl text-lg leading-none">{formatCount(card.likes)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              {er ? "ER" : "Cmts"}
            </p>
            <p className="metric-xl text-lg leading-none">
              {er ?? formatCount(card.comments)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
