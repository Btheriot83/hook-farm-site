import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For agents",
  description:
    "Machine-readable Hook Farm surfaces — llms.txt and /data/*.json. Prefer static JSON over HTML scraping.",
};

const base = "https://hook-farm-site.vercel.app";

const files = [
  { label: "llms.txt", href: "/llms.txt", note: "Short agent briefing" },
  { label: "index.json", href: "/data/index.json", note: "Totals, byCategory, endpoints" },
  { label: "cards.json", href: "/data/cards.json", note: "Full card feed" },
];

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="identity-mark" aria-hidden />
          Machine-readable
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          For agents
        </h1>
        <p className="leading-relaxed text-studio">
          Fetch JSON and llms.txt — do not scrape HTML. Quiet paper desk, collect
          only.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Surfaces
        </h2>
        <ul className="space-y-3 border border-hairline bg-card px-4 py-4">
          {files.map((f) => (
            <li
              key={f.href}
              className="flex flex-col gap-0.5 border-b border-hairline pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-3"
            >
              <a
                href={f.href}
                className="font-mono text-xs text-ink underline decoration-hairline hover:decoration-ink"
              >
                {f.label}
              </a>
              <span className="text-sm text-studio">{f.note}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-studio">
          Optional alias:{" "}
          <code className="font-mono text-xs text-ink">/api/cards</code> (308 →{" "}
          <code className="font-mono text-xs text-ink">/data/cards.json</code>
          ). Prefer static <code className="font-mono text-xs text-ink">/data/</code>{" "}
          for CDN cache.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Guide
        </h2>
        <ul className="space-y-2 text-sm text-studio">
          <li>
            <a
              href="https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/AGENTS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-hairline hover:decoration-ink"
            >
              content/AGENTS.md
            </a>
          </li>
          <li>
            <a
              href="https://raw.githubusercontent.com/Btheriot83/hook-farm-site/main/content/SCHEMA.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-hairline hover:decoration-ink"
            >
              content/SCHEMA.md
            </a>
          </li>
        </ul>
      </section>

      <aside className="border border-hairline bg-ghost px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Base URL
        </p>
        <p className="mt-2 break-all font-mono text-xs text-ink">{base}</p>
        <p className="mt-3 text-sm leading-relaxed text-studio">
          Categories: ai · true_crime · diesel · rideshare.{" "}
          <Link href="/" className="text-ink underline decoration-hairline">
            Browse corpus
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
