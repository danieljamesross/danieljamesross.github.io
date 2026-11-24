"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuIcon from "./MenuIcon";
import MobileMenu from "./MobileMenu";
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

// Below Tailwind's `sm` breakpoint the nav moves into MobileMenu.
const PHONE = "(max-width: 639.98px)";

export default function SiteHeader() {
  const pathname = usePathname();
  const here = currentIndex(pathname);
  const ref = useRef<HTMLElement>(null);
  const { compact, hidden } = useScrollState(ref);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  // Any change of page closes it, including the browser's back button.
  const [menuPage, setMenuPage] = useState(pathname);
  if (pathname !== menuPage) {
    setMenuPage(pathname);
    setMenuOpen(false);
  }

  // Widening past the breakpoint brings the inline nav back.
  useEffect(() => {
    if (!menuOpen) return;
    const phone = matchMedia(PHONE);
    const onChange = () => !phone.matches && setMenuOpen(false);
    phone.addEventListener("change", onChange);
    return () => phone.removeEventListener("change", onChange);
  }, [menuOpen]);

  const links = NAV_LINKS.map((link, i) => ({
    ...link,
    transitionTypes: transitionTypes(i, here),
    current: i === here,
  }));

  return (
    <header
      ref={ref}
      data-motion
      data-compact={compact || undefined}
      data-hidden={hidden || undefined}
      data-menu-open={menuOpen || undefined}
      // Only its children take clicks: while it's a bar, the rest of its
      // box is empty and the page underneath should still be clickable.
      className="site-header pointer-events-none sticky top-0 z-40"
      style={{ viewTransitionName: "site-header" }}
    >
      <div
        aria-hidden
        className="site-header__backdrop absolute inset-0 -z-10 border-b border-black/10 bg-background/85 backdrop-blur-md dark:border-white/15"
      />
      {/* One row: on phones the name, theme toggle and menu button; wider,
          the name, nav and theme toggle. */}
      <div className="site-header__inner mx-auto grid max-w-4xl grid-cols-[1fr_auto_auto] items-end gap-x-4 px-6 py-8 sm:gap-x-6">
        <Link
          href="/"
          transitionTypes={transitionTypes(0, here)}
          onClick={closeMenu}
          className="pointer-events-auto justify-self-start"
        >
          <h1 className="site-header__name text-2xl font-semibold tracking-tight">
            Daniel James Ross
          </h1>
          <p className="site-header__subtitle font-mono text-sm text-black/60 dark:text-white/50">
            arty codey
          </p>
        </Link>
        <nav
          aria-label="Main"
          className="pointer-events-auto hidden sm:col-start-2 sm:block"
        >
          <ul className="flex gap-6 font-mono text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  transitionTypes={link.transitionTypes}
                  aria-current={link.current ? "page" : undefined}
                  className="relative flex h-8 items-center whitespace-nowrap text-black/70 transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:text-black hover:after:scale-x-100 aria-[current=page]:text-black aria-[current=page]:after:scale-x-100 dark:text-white/70 dark:hover:text-white dark:aria-[current=page]:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle className="pointer-events-auto sm:col-start-3" />
        <button
          ref={menuButton}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="group/menu pointer-events-auto relative grid size-8 place-items-center rounded-full text-black/70 transition-colors hover:bg-black/5 hover:text-black aria-expanded:text-black sm:hidden dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:aria-expanded:text-white"
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
      <MobileMenu
        open={menuOpen}
        links={links}
        button={menuButton}
        onClose={closeMenu}
      />
    </header>
  );
}
