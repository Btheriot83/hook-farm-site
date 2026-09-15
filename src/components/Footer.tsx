import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Hook Farm — read-only corpus browser. Collect only; no engagement.</p>
        <p>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <span className="mx-2">·</span>
          <Link href="/patterns" className="hover:text-accent">
            Patterns
          </Link>
        </p>
      </div>
    </footer>
  );
}
