"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { motionDuration, prefersReducedMotion } from "@/lib/motion";
import { THEME_KEY } from "./ThemeScript";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function isDark() {
  const chosen = document.documentElement.dataset.theme;
  return chosen ? chosen === "dark" : matchMedia(DARK_QUERY).matches;
}

function subscribe(onChange: () => void) {
  const attributes = new MutationObserver(onChange);
  attributes.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });
  const system = matchMedia(DARK_QUERY);
  system.addEventListener("change", onChange);
  return () => {
    attributes.disconnect();
    system.removeEventListener("change", onChange);
  };
}

function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private browsing: the choice just won't outlast the visit.
  }
}

/**
 * Switches between light and dark. Where view transitions are supported the
 * new theme spreads out from the button in a circle, taking longer the
 * further it has to reach.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  // Unknown until hydrated, since the server can't see the visitor's theme.
  const dark = useSyncExternalStore(subscribe, isDark, () => null);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark() ? "light" : "dark";
    if (!document.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    const root = document.documentElement;
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(() => setTheme(next));
    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: motionDuration(radius),
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
    transition.finished.finally(() => delete root.dataset.themeSwitching);
  };

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={dark ?? undefined}
      onClick={toggle}
      className={`group/theme grid size-8 place-items-center rounded-full text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      {/* Shows the theme you'd switch to. Drawn inline rather than with Font
          Awesome, which would otherwise load on every page with the header. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-4 fill-current transition-transform motion-safe:group-hover/theme:-rotate-12 dark:hidden"
      >
        <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="hidden size-4 fill-none stroke-current stroke-2 transition-transform [stroke-linecap:round] motion-safe:group-hover/theme:rotate-45 dark:block"
      >
        <circle cx="12" cy="12" r="4" className="fill-current" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
