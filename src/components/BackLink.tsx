import Link from "next/link";

/** A "← …" link back up the site, which slides the page back. */
export default function BackLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      className="group/back font-mono text-sm text-black/60 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
    >
      <span
        aria-hidden
        className="inline-block transition-transform motion-safe:group-hover/back:-translate-x-1"
      >
        ←
      </span>{" "}
      {children}
    </Link>
  );
}
