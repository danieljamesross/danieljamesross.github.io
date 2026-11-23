"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Projects" },
  { href: "/composition", label: "Composition" },
  { href: "/lines", label: "Lines" },
  { href: "/blob", label: "Blob" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

// Scrolled further than this, the header shrinks to a bar.
const COMPACT_AFTER = 24;
// Scroll movements smaller than this don't count as changing direction.
const SCROLL_SLOP = 6;

function currentIndex(pathname: string) {
  // Project pages belong under Projects.
  if (pathname.startsWith("/portfolio/")) return 0;
  return NAV_LINKS.findIndex(({ href }) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`),
  );
}

/**
 * Page transitions slide by where the destination sits in the nav relative
 * to here: further along goes forward, earlier goes back.
 */
function transitionTypes(to: number, from: number) {
  if (from === -1 || to === from) return [];
  return [to > from ? "nav-forward" : "nav-back"];
}

/** Whether the page is scrolled from the top, and whether it's heading down. */
function useScrollState(header: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ compact: false, hidden: false });

  useEffect(() => {
    let lastY = scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(scrollY, 0);
      const compact = y > COMPACT_AFTER;
      const dy = y - lastY;
      // Only hide once the header would have scrolled out of view anyway.
      const pastHeader = y > (header.current?.offsetHeight ?? 0);
      setState((prev) => {
        let hidden = prev.hidden;
        if (!pastHeader) hidden = false;
        else if (dy > SCROLL_SLOP) hidden = true;
        else if (dy < -SCROLL_SLOP) hidden = false;
        return prev.compact === compact && prev.hidden === hidden
          ? prev
          : { compact, hidden };
      });
      // Let small movements add up until they count.
      if (Math.abs(dy) > SCROLL_SLOP || !pastHeader) lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [header]);

  return state;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const here = currentIndex(pathname);
  const ref = useRef<HTMLElement>(null);
  const { compact, hidden } = useScrollState(ref);

  return (
    <header
      ref={ref}
      data-motion
      data-compact={compact || undefined}
      data-hidden={hidden || undefined}
      // Only its children take clicks: while it's a bar, the rest of its
      // box is empty and the page underneath should still be clickable.
      className="site-header pointer-events-none sticky top-0 z-40"
      style={{ viewTransitionName: "site-header" }}
    >
      <div
        aria-hidden
        className="site-header__backdrop absolute inset-0 -z-10 border-b border-black/10 bg-background/85 backdrop-blur-md dark:border-white/15"
      />
      <div className="site-header__inner mx-auto grid max-w-4xl grid-cols-[1fr_auto] gap-x-6 gap-y-4 px-6 py-8 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <Link
          href="/"
          transitionTypes={transitionTypes(0, here)}
          className="pointer-events-auto col-start-1 row-start-1 justify-self-start"
        >
          <h1 className="site-header__name text-2xl font-semibold tracking-tight">
            Daniel James Ross
          </h1>
          <p className="site-header__subtitle font-mono text-sm text-black/60 dark:text-white/50">
            arty codey
          </p>
        </Link>
        <ThemeToggle className="pointer-events-auto col-start-2 row-start-1 self-start sm:col-start-3 sm:self-end" />
        <nav
          aria-label="Main"
          // On narrow screens the links scroll sideways rather than wrap, so
          // the bar stays one row; the fade hints there's more.
          className="pointer-events-auto col-span-2 row-start-2 -mx-6 overflow-x-auto pl-6 [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none] sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:mx-0 sm:overflow-visible sm:pl-0 sm:[mask-image:none]"
        >
          {/* The end padding is on the list so it scrolls in after the last link
              rather than staying under the fade. */}
          <ul className="flex w-max gap-6 pr-6 font-mono text-sm sm:w-auto sm:pr-0">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  transitionTypes={transitionTypes(i, here)}
                  aria-current={i === here ? "page" : undefined}
                  className="relative flex h-8 items-center whitespace-nowrap text-black/70 transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:text-black hover:after:scale-x-100 aria-[current=page]:text-black aria-[current=page]:after:scale-x-100 dark:text-white/70 dark:hover:text-white dark:aria-[current=page]:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
