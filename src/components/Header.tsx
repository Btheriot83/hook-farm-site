import Link from "next/link";

const NAV = [
  { href: "/", label: "Corpus" },
  { href: "/patterns", label: "Patterns" },
  { href: "/stats", label: "Stats" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-hairline bg-paper">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-4 py-5 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-0">
          <span className="identity-mark" aria-hidden />
          <span className="font-display text-[1.4rem] leading-none tracking-tight text-ink lowercase sm:text-[1.55rem]">
            hook farm
          </span>
        </Link>
        <nav className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-studio">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-transparent pb-0.5 transition-colors hover:border-ink hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
