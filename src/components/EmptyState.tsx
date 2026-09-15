export function EmptyState() {
  return (
    <div className="border border-hairline bg-card px-6 py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        Folio empty
      </p>
      <p className="mt-4 font-display text-3xl tracking-tight text-ink sm:text-4xl">
        Harvest in progress
      </p>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-studio">
        Cards appear here as Hook Farm collects winners. Thumbs stay color;
        chrome stays paper and ink.
      </p>
      <p className="mx-auto mt-5 max-w-sm text-sm text-faint">
        Drop files in{" "}
        <code className="rounded-sm border border-hairline bg-ghost px-1.5 py-0.5 font-mono text-xs text-studio">
          content/cards/
        </code>{" "}
        and redeploy — the desk fills.
      </p>
    </div>
  );
}
