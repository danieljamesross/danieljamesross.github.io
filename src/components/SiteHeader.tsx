import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Projects" },
  { href: "/composition", label: "Composition" },
  { href: "/lines", label: "Lines" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <Link href="/" className="group">
          <h1 className="text-2xl font-semibold tracking-tight">Daniel James Ross</h1>
          <p className="font-mono text-sm text-black/50 dark:text-white/50">arty codey</p>
        </Link>
        <nav className="flex gap-6 font-mono text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
