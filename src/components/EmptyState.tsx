export function EmptyState() {
  return (
    <div className="rounded-sm border border-dashed border-ink/25 bg-paper-shade/60 px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink sm:text-3xl">
        Harvest in progress
      </p>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/65">
        Cards appear here as Hook Farm collects winners.
      </p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-ink/45">
        When new files land in{" "}
        <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs">
          content/cards/
        </code>{" "}
        and the site redeploys, this grid fills in.
      </p>
    </div>
  );
}
