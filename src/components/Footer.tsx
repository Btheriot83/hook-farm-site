export function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-3 px-4 py-7 text-xs text-faint sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
          Collect only — no likes, comments, or follows
        </p>
        <p className="tabular-nums text-faint">read-only corpus browser</p>
      </div>
    </footer>
  );
}
