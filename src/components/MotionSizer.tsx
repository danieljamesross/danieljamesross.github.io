"use client";

import { useEffect } from "react";
import { diagonal } from "@/lib/motion";

// Elements whose transitions are timed by their size (see "Motion" in
// src/app/globals.css).
const SIZED = "a, button, [data-motion]";

/**
 * Keeps --motion-size on every link, button and data-motion element set to
 * its diagonal, and the page-wide sizes page transitions are timed by on
 * <html>. Renders nothing.
 */
export default function MotionSizer() {
  useEffect(() => {
    const root = document.documentElement;

    const resizes = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        (target as HTMLElement).style.setProperty(
          "--motion-size",
          diagonal(target).toFixed(0),
        );
      }
    });
    const observe = (node: Node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(SIZED)) resizes.observe(node);
      node.querySelectorAll(SIZED).forEach((el) => resizes.observe(el));
    };
    observe(document.body);
    // Pages swap their content on navigation.
    const additions = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(observe);
    });
    additions.observe(document.body, { childList: true, subtree: true });

    const setPageSize = () =>
      root.style.setProperty(
        "--page-size",
        Math.hypot(innerWidth, innerHeight).toFixed(0),
      );
    setPageSize();
    addEventListener("resize", setPageSize);

    // A project image morphs between its card and its page. Size the morph
    // by the image being left, read before the page changes: the one in the
    // clicked link, or else the one on this page.
    const setMorphSize = (link: Element | null) => {
      const image =
        link?.querySelector("[data-morph]") ??
        document.querySelector("[data-morph]");
      if (image) {
        root.style.setProperty("--morph-size", diagonal(image).toFixed(0));
      }
    };
    const onClick = (e: MouseEvent) =>
      setMorphSize((e.target as Element).closest("a"));
    const onPopState = () => setMorphSize(null);
    document.addEventListener("click", onClick, { capture: true });
    addEventListener("popstate", onPopState);

    return () => {
      resizes.disconnect();
      additions.disconnect();
      removeEventListener("resize", setPageSize);
      document.removeEventListener("click", onClick, { capture: true });
      removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}
