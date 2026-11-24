"use client";

import { useRef, useSyncExternalStore, type MouseEvent } from "react";
import { motionDuration, prefersReducedMotion } from "@/lib/motion";
import ThemeIcon, { animateThemeIcon } from "./ThemeIcon";
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
 * further it has to reach, while the icon turns into the other one.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  // Unknown until hydrated, since the server can't see the visitor's theme.
  const dark = useSyncExternalStore(subscribe, isDark, () => null);
  const icon = useRef<SVGSVGElement>(null);
  const iconAnimations = useRef<Animation[]>([]);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark() ? "light" : "dark";
    iconAnimations.current.forEach((animation) => animation.cancel());
    iconAnimations.current = [];
    if (prefersReducedMotion()) {
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
    const duration = motionDuration(radius);
    // Started with the change, so the icon never shows the new pose first.
    const change = () => {
      setTheme(next);
      if (icon.current)
        iconAnimations.current = animateThemeIcon(
          icon.current,
          next === "dark",
          duration,
        );
    };
    if (!document.startViewTransition) {
      change();
      return;
    }

    const root = document.documentElement;
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(change);
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
            duration,
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
      <ThemeIcon
        ref={icon}
        className="size-4 transition-transform motion-safe:group-hover/theme:-rotate-12 motion-safe:dark:group-hover/theme:rotate-45"
      />
    </button>
  );
}
