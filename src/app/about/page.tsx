import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="identity-mark" aria-hidden />
          Desk note
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          About
        </h1>
      </header>

      <p className="text-lg leading-relaxed text-studio">
        Hook Farm harvests public viral packaging — hooks, titles, on-screen
        text, early transcript — so you can study craft patterns across
        platforms. This site is the read-only desk for that corpus.
      </p>

      <section className="space-y-3 border-l-2 border-ink pl-4">
        <h2 className="font-display text-xl text-ink">Collect only</h2>
        <p className="leading-relaxed text-studio">
          Never likes, comments, follows, posts, or DMs. Public content only. No
          engagement actions live here — browse, sort, learn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">How to read a card</h2>
        <ol className="space-y-4 border border-hairline bg-card">
          <ReadStep n="01" title="Thumb">
            The only color on the page. Read the packaging as a silent scroller
            would — face, text overlay, composition — before the metrics.
          </ReadStep>
          <ReadStep n="02" title="Metrics strip">
            Views, likes, comments, saves, and ER (likes÷views when both exist).
            Null stays “—”; nothing is invented.
          </ReadStep>
          <ReadStep n="03" title="Hook pair">
            On-screen vs spoken side by side. Often they differ — the gap is the
            craft.
          </ReadStep>
          <ReadStep n="04" title="Patterns">
            Each tag opens craft notes: definition, when it works / fails, and
            sibling cards that share the move.
          </ReadStep>
          <ReadStep n="05" title="Transcript (~30s)">
            Typeset evidence of the open. Compare to the hook promise — did the
            first half-minute deliver?
          </ReadStep>
          <ReadStep n="06" title="Provenance">
            Collected date, post date, platform, format, niche tags. Schema
            fields from{" "}
            <code className="font-mono text-xs text-ink">SCHEMA.md</code>.
          </ReadStep>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">Schema-facing</h2>
        <p className="leading-relaxed text-studio">
          Cards live in{" "}
          <code className="rounded-sm border border-hairline bg-ghost px-1 font-mono text-sm text-ink">
            content/cards/
          </code>{" "}
          (markdown + YAML frontmatter, or JSON). Thumbs and transcripts mirror
          under content/ and are copied to{" "}
          <code className="rounded-sm border border-hairline bg-ghost px-1 font-mono text-sm text-ink">
            public/thumbs/
          </code>{" "}
          for deploy. See{" "}
          <code className="rounded-sm border border-hairline bg-ghost px-1 font-mono text-sm text-ink">
            content/SCHEMA.md
          </code>{" "}
          and{" "}
          <code className="rounded-sm border border-hairline bg-ghost px-1 font-mono text-sm text-ink">
            scripts/SYNC.md
          </code>
          .
        </p>
      </section>

      <p className="pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        <Link href="/" className="hover:text-ink">
          ← Corpus
        </Link>
        <span className="mx-3">·</span>
        Brandon Theriot · Hook Farm
      </p>
    </article>
  );
}

function ReadStep({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4 border-b border-hairline px-4 py-4 last:border-0">
      <span className="font-mono text-[11px] text-faint">{n}</span>
      <div>
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-studio">{children}</p>
      </div>
    </li>
  );
}
