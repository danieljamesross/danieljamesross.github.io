import { expect, type Page } from "@playwright/test";

/**
 * Collects console errors and uncaught exceptions. Read it before leaving the
 * page: Safari reports Next's prefetches as failed fetches when a navigation
 * cancels them.
 */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

type RecordedTransition = { types: string[]; ms: number | null };

declare global {
  interface Window {
    __viewTransitions: RecordedTransition[];
  }
}

/**
 * Records every view transition the page starts, with its types (React passes
 * the navigation's transitionTypes through) and how long it took, so tests
 * can check which page transition ran. Call before navigating to the page.
 */
export async function recordViewTransitions(page: Page) {
  await page.addInitScript(() => {
    window.__viewTransitions = [];
    const start = Document.prototype.startViewTransition;
    if (!start) return;
    Document.prototype.startViewTransition = function (
      this: Document,
      arg?: ViewTransitionUpdateCallback | StartViewTransitionOptions,
    ) {
      const types =
        arg && typeof arg === "object" && arg.types ? [...arg.types] : [];
      const record: RecordedTransition = { types, ms: null };
      window.__viewTransitions.push(record);
      const started = performance.now();
      const transition = start.call(this, arg);
      transition.finished.finally(
        () => (record.ms = performance.now() - started),
      );
      return transition;
    };
  });
}

/**
 * Waits for the page's view transitions to finish, and returns their types.
 * With `{ timed: true }`, returns each one's types and duration instead.
 */
export async function finishedTransitions(page: Page): Promise<string[][]>;
export async function finishedTransitions(
  page: Page,
  options: { timed: true },
): Promise<RecordedTransition[]>;
export async function finishedTransitions(page: Page, { timed = false } = {}) {
  await expect
    .poll(() =>
      page.evaluate(() => window.__viewTransitions.every((t) => t.ms !== null)),
    )
    .toBe(true);
  const recorded = await page.evaluate(() => window.__viewTransitions);
  return timed ? recorded : recorded.map((t) => t.types);
}

/** The header's scroll states: shrunk to a bar, and hidden. */
export async function headerState(page: Page) {
  return page.locator(".site-header").evaluate((header) => ({
    compact: header.hasAttribute("data-compact"),
    hidden: header.hasAttribute("data-hidden"),
  }));
}

/** Scrolls by `dy` px in steps, as a person would, then lets transitions end. */
export async function scrollBy(page: Page, dy: number) {
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((step) => window.scrollBy(0, step), dy / steps);
    await page.waitForTimeout(30);
  }
  // Longer than the longest transition (--motion-max).
  await page.waitForTimeout(800);
}

export const NAV = [
  "Projects",
  "Composition",
  "Lines",
  "Blob",
  "CV",
  "Contact",
] as const;

export const nav = (page: Page) =>
  page.getByRole("navigation", { name: "Main" });
