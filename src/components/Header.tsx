import Link from "next/link";

const NAV = [
  { href: "/", label: "Corpus" },
  { href: "/patterns", label: "Patterns" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-hairline bg-paper">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <span className="font-display text-xl tracking-tight text-ink lowercase sm:text-[1.35rem]">
            hook farm
          </span>
        </Link>
        <nav className="flex gap-5 text-xs uppercase tracking-wider text-studio">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
