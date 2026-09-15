export function EmptyState() {
  return (
    <div className="border border-hairline bg-ghost px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink sm:text-3xl">
        Harvest in progress
      </p>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-studio">
        Cards appear here as Hook Farm collects winners.
      </p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-faint">
        When new files land in{" "}
        <code className="rounded-sm bg-paper px-1.5 py-0.5 font-mono text-xs text-studio">
          content/cards/
        </code>{" "}
        and the site redeploys, this grid fills in.
      </p>
    </div>
  );
}
