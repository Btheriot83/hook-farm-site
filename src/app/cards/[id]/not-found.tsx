import Link from "next/link";

export default function CardNotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 border border-hairline bg-ghost px-6 py-16 text-center">
      <h1 className="font-display text-3xl text-ink">Card not found</h1>
      <p className="text-studio">
        No card with that id in the current corpus deploy.
      </p>
      <Link
        href="/"
        className="inline-block border border-ink px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
      >
        ← Back to corpus
      </Link>
    </div>
  );
}
