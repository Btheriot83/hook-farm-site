import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="prose-farm max-w-2xl space-y-6">
      <h1 className="font-display text-4xl tracking-tight text-ink">About</h1>

      <p className="text-lg leading-relaxed text-ink/75">
        Hook Farm is a harvest agent that collects public viral packaging
        examples — hooks, titles, on-screen text, early transcript — so humans
        can study craft patterns across platforms.
      </p>

      <section className="space-y-3 border-l-2 border-accent/50 pl-4">
        <h2 className="font-display text-xl text-ink">Collect only</h2>
        <p className="leading-relaxed text-ink/70">
          This site is a <strong>read-only browser</strong>. The harvest agent
          never likes, comments, follows, posts, DMs, or otherwise engages
          accounts. Public content only. No engagement actions live here.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">What you see</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink/70">
          <li>
            Cards in <code className="rounded bg-ink/5 px-1 font-mono text-sm">content/cards/</code>{" "}
            (markdown with YAML frontmatter, or JSON)
          </li>
          <li>Optional thumbnails and transcript mirrors under content/</li>
          <li>
            A pattern glossary for packaging craft tags, useful before any cards
            exist
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">How cards arrive</h2>
        <p className="leading-relaxed text-ink/70">
          The harvest agent writes into an agent workspace corpus. Operators
          copy that tree into this repo’s <code className="rounded bg-ink/5 px-1 font-mono text-sm">content/</code>{" "}
          folder, commit, and push — Vercel redeploys and the grid updates. See{" "}
          <code className="rounded bg-ink/5 px-1 font-mono text-sm">scripts/SYNC.md</code>.
        </p>
      </section>

      <p className="pt-4 text-sm text-ink/45">
        Built for Brandon Theriot · Hook Farm public corpus
      </p>
    </article>
  );
}
