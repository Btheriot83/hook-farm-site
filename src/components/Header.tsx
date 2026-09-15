import Link from "next/link";

const NAV = [
  { href: "/", label: "Corpus" },
  { href: "/patterns", label: "Patterns" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-ink/15 bg-paper/90 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-4 py-5 sm:px-6">
        <Link href="/" className="group">
          <span className="font-display text-xl tracking-tight text-ink sm:text-2xl">
            Hook Farm
          </span>
          <span className="ml-2 hidden text-sm text-ink/50 sm:inline">
            viral packaging corpus
          </span>
        </Link>
        <nav className="flex gap-5 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink/70 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
