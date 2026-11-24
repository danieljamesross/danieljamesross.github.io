import { expect, test, type Page } from "@playwright/test";
import {
  collectErrors,
  closeNav,
  finishedTransitions,
  navLink,
  recordViewTransitions,
} from "./support";

declare global {
  interface Window {
    __sameDocument?: boolean;
  }
}

/** Marks the document, to check later navigations didn't reload it. */
const markDocument = (page: Page) =>
  page.evaluate(() => (window.__sameDocument = true));
const sameDocument = (page: Page) =>
  page.evaluate(() => window.__sameDocument === true);

test.beforeEach(async ({ page }) => {
  await recordViewTransitions(page);
  await page.goto("/");
  // Let Next prefetch the links, as it would for a visitor.
  await page.waitForLoadState("networkidle");
  await markDocument(page);
});

test("header links slide forward and back by nav order", async ({ page }) => {
  await (await navLink(page, "CV")).click();
  await expect(page).toHaveURL("/cv/");
  await expect(
    page.getByRole("heading", { name: "CV", level: 1 }),
  ).toBeVisible();
  await expect(await navLink(page, "CV")).toHaveAttribute(
    "aria-current",
    "page",
  );
  const [slide] = await finishedTransitions(page, { timed: true });
  expect(slide.types).toEqual(["nav-forward"]);
  // Long enough to see (the exact timing is checked in motion.spec.ts).
  expect(slide.ms).toBeGreaterThan(300);

  await (await navLink(page, "Composition")).click();
  await expect(page).toHaveURL("/composition/");
  await expect(
    page.getByRole("heading", { name: "Composition", level: 1 }),
  ).toBeVisible();
  expect(await finishedTransitions(page)).toEqual([
    ["nav-forward"],
    ["nav-back"],
  ]);
  expect(await sameDocument(page)).toBe(true);
});

test("a project opens from its card and goes back", async ({ page }) => {
  const errors = collectErrors(page);
  await page.getByRole("link", { name: /^Giant Leap/ }).click();
  await expect(page).toHaveURL("/portfolio/giant-leap/");
  await expect(
    page.getByRole("heading", { name: "Giant Leap", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: "Giant Leap" })).toBeVisible();
  // Projects stays current on a project's page.
  await expect(await navLink(page, "Projects")).toHaveAttribute(
    "aria-current",
    "page",
  );
  await closeNav(page);

  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: /^Giant Leap/ })).toBeVisible();
  expect(await finishedTransitions(page)).toEqual([
    ["nav-forward"],
    ["nav-back"],
  ]);
  expect(await sameDocument(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("pieces with their own layouts transition too", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit" && process.platform === "win32",
    "Playwright's Windows build of WebKit crashes leaving Lines; WebKit on " +
      "macOS and Linux passes, and there's no Safari for Windows",
  );
  // On a starved CPU this is slow: React reveals Blob only once the page
  // transition ends, and Blob then sets up its WebGL software renderer. In
  // WebKit for Linux with two CPUs shared by four pages, transitions took up
  // to 10s to finish and Blob up to 15s to appear (it's ~1s unloaded), and
  // GitHub's runners are slower still. Loading speed is pages.spec.ts's
  // concern; this checks the transitions happen.
  test.slow();
  await (await navLink(page, "Blob")).click();
  await expect(page).toHaveURL("/blob/");
  await expect(page.locator("main canvas").first()).toBeAttached({
    timeout: 45_000,
  });
  await (await navLink(page, "Lines")).click();
  await expect(page).toHaveURL("/lines/");
  await (await navLink(page, "Composition")).click();
  await expect(page).toHaveURL("/composition/");
  expect(await finishedTransitions(page)).toEqual([
    ["nav-forward"],
    ["nav-back"],
    ["nav-back"],
  ]);
  expect(await sameDocument(page)).toBe(true);
});

test("the browser's back and forward buttons work", async ({ page }) => {
  await (await navLink(page, "Composition")).click();
  await expect(page).toHaveURL("/composition/");
  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: /^Giant Leap/ })).toBeVisible();
  await expect(await navLink(page, "Projects")).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "Composition", level: 1 }),
  ).toBeVisible();
});

test("reduced motion makes page changes near-instant", async ({ page }) => {
  await (await navLink(page, "CV")).click();
  await expect(page).toHaveURL("/cv/");
  const [normal] = await finishedTransitions(page, { timed: true });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await (await navLink(page, "Composition")).click();
  await expect(page).toHaveURL("/composition/");
  const [, reduced] = await finishedTransitions(page, { timed: true });

  // The transition still runs, but its animations take no time, leaving only
  // a frame or two. Frames are slow on some CI runners, so compare with the
  // full transition on the same machine rather than a fixed time. (Reading
  // the animations with getAnimations() mid-transition crashes WebKit.)
  expect(reduced.ms).toBeLessThan(normal.ms! / 2);
});
