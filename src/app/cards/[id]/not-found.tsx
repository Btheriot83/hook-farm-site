import Link from "next/link";

export default function CardNotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h1 className="font-display text-3xl text-ink">Card not found</h1>
      <p className="text-ink/60">
        No card with that id in the current corpus deploy.
      </p>
      <Link href="/" className="inline-block text-accent hover:underline">
        ← Back to corpus
      </Link>
    </div>
  );
}
