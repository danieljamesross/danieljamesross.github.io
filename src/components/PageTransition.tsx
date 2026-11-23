import { ViewTransition, type ReactNode } from "react";

// Links tag navigations "nav-forward" or "nav-back" (see SiteHeader); one
// with neither, like Projects from a project page, gets a gentle fade. The
// browser's back and forward buttons don't animate: Next applies them
// outside a transition. The animations are in src/app/globals.css.
const ANIMATION = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-fade",
};

/**
 * Animates a page in and out on navigation. It only plays when it's the
 * outermost thing added or removed, with no element above it that's also
 * going: so it wraps a template's page, or a layout's <main> for moves
 * between layouts.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={ANIMATION} exit={ANIMATION} default="none">
      {children}
    </ViewTransition>
  );
}
