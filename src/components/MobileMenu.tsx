// Rendered only by SiteHeader, a Client Component, so this is one too.
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { diagonal, motionDuration, prefersReducedMotion } from "@/lib/motion";

export type MenuLink = {
  href: string;
  label: string;
  transitionTypes: string[];
  current: boolean;
};

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";

/** The circle, centred on the menu button, that the panel grows out of. */
function circleFrom(button: HTMLElement | null) {
  const rect = button?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : innerWidth;
  const y = rect ? rect.top + rect.height / 2 : 0;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  return {
    radius,
    closed: `circle(0px at ${x}px ${y}px)`,
    open: `circle(${radius}px at ${x}px ${y}px)`,
  };
}

/**
 * The phone-sized nav: a full-screen panel under the header that grows out
 * of the menu button in a circle, its links rising in one after another.
 * Each part's timing follows its size, like everything else on the site.
 *
 * While it's open the page behind can't be focused or scrolled, focus starts
 * on the first link, and Escape closes it, handing focus back to the button.
 */
export default function MobileMenu({
  open,
  links,
  button,
  onClose,
}: {
  open: boolean;
  links: MenuLink[];
  button: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  // Stays mounted while the closing animation plays.
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const panel = useRef<HTMLDivElement>(null);
  const instantClose = useRef(false);
  const close = useEffectEvent(() => onClose());

  // Animate in, or out and then unmount.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!present || !el) return;
    const items = [...el.querySelectorAll<HTMLElement>("[data-menu-item]")];
    if (open) {
      if (prefersReducedMotion()) return;
      const circle = circleFrom(button.current);
      const duration = motionDuration(circle.radius);
      el.animate(
        { clipPath: [circle.closed, circle.open] },
        { duration, easing: EASE_OUT },
      );
      items.forEach((item, i) =>
        item.animate(
          [
            { opacity: 0, translate: "0 1.5rem", filter: "blur(6px)" },
            { opacity: 1, translate: "0 0", filter: "blur(0)" },
          ],
          {
            duration: motionDuration(diagonal(item)) * 2,
            // In turn, starting once the circle has some size.
            delay: duration * (0.2 + i * 0.07),
            easing: EASE_OUT,
            fill: "backwards",
          },
        ),
      );
      return;
    }
    if (instantClose.current || prefersReducedMotion()) {
      instantClose.current = false;
      setPresent(false);
      return;
    }
    const circle = circleFrom(button.current);
    const duration = motionDuration(circle.radius) * 0.7;
    for (const item of items) {
      item.animate(
        { opacity: [1, 0], translate: ["0 0", "0 -0.5rem"] },
        { duration: duration * 0.5, easing: EASE_IN, fill: "forwards" },
      );
    }
    const closing = el.animate(
      { clipPath: [circle.open, circle.closed] },
      { duration, easing: EASE_IN, fill: "forwards" },
    );
    closing.finished.then(() => setPresent(false)).catch(() => {});
    return () => closing.cancel();
  }, [open, present, button]);

  // While open: hold focus and scroll, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const behind = [...document.querySelectorAll<HTMLElement>("main, footer")];
    behind.forEach((el) => (el.inert = true));
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      button.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => (el.inert = false));
      root.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, button]);

  if (!present) return null;
  return createPortal(
    <div
      ref={panel}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-30 overflow-y-auto bg-background sm:hidden"
    >
      <nav
        aria-label="Main"
        className="flex min-h-full flex-col justify-center px-6 pt-28 pb-16"
      >
        <ul className="flex flex-col gap-1">
          {links.map((link, i) => (
            <li key={link.href} data-menu-item>
              <Link
                href={link.href}
                transitionTypes={link.transitionTypes}
                aria-current={link.current ? "page" : undefined}
                onClick={() => {
                  // The page transition takes over from here.
                  instantClose.current = true;
                  onClose();
                }}
                className="group/item flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground"
              >
                <span
                  aria-hidden
                  className="w-6 font-mono text-sm font-normal text-accent-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-accent transition-transform group-hover/item:scale-x-100 group-aria-[current=page]/item:scale-x-100"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p data-menu-item className="mt-10 font-mono text-sm text-muted">
          arty codey
        </p>
      </nav>
    </div>,
    document.body,
  );
}
