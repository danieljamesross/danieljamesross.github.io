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

// `ms` runs from when the animations start to when they end: it leaves out
// rendering the new page and taking snapshots, which on slow CI machines can
// take longer than the animations themselves.
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
      const transition = start.call(this, arg);
      let started: number | null = null;
      transition.ready
        .then(() => (started = performance.now()))
        .catch(() => {});
      transition.finished.finally(
        () => (record.ms = started === null ? 0 : performance.now() - started),
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
  // Only waiting, not judging speed: on a starved CI runner a transition
  // can take ten seconds to finish.
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          window.__viewTransitions.every((t) => t.ms !== null),
        ),
      { timeout: 30_000 },
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

/**
 * Waits for React to hydrate the page: MotionSizer, which runs then, sets
 * --page-size on <html>.
 */
export async function hydrated(page: Page) {
  await page.waitForFunction(
    () => document.documentElement.style.getPropertyValue("--page-size") !== "",
  );
}

/**
 * Waits for whatever the last change set moving to stop: two frames, so its
 * transitions have started, then until no animation is running. Faster and
 * steadier than sleeping for the longest transition.
 */
export async function settled(page: Page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

/** Scrolls by `dy` px over a few frames, as a person would, then settles. */
export async function scrollBy(page: Page, dy: number) {
  await page.evaluate(async (dy) => {
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      window.scrollBy(0, dy / steps);
      await new Promise(requestAnimationFrame);
    }
  }, dy);
  await settled(page);
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

export const menuButton = (page: Page) =>
  page.getByRole("button", { name: "Menu" });

/**
 * The site's main nav, ready to use: inline on wider screens, and on phones
 * in the menu, which this opens.
 */
export async function openNav(page: Page) {
  const button = menuButton(page);
  if (
    (await button.isVisible()) &&
    (await button.getAttribute("aria-expanded")) !== "true"
  ) {
    await button.click();
  }
  return nav(page);
}

/** Closes the phone menu, if it's open, to get back to the page. */
export async function closeNav(page: Page) {
  const button = menuButton(page);
  if (
    (await button.isVisible()) &&
    (await button.getAttribute("aria-expanded")) === "true"
  ) {
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toHaveCount(0);
  }
}

/** A link in the main nav, opening the menu first on phones. */
export async function navLink(page: Page, name: string) {
  return (await openNav(page)).getByRole("link", { name, exact: true });
}
