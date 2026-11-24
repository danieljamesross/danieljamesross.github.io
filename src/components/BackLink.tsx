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
      className="group/back font-mono text-sm text-muted transition-colors hover:text-foreground"
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
