import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { staticRoutes } from "../scripts/static-routes.cjs";

// WCAG 2.2 A and AA, plus axe's best-practice rules.
const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(TAGS)
    .analyze();
  // Summarise rather than dumping axe's full result objects, so a failure
  // says what is wrong and where.
  const summary = violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
  expect(summary).toEqual([]);
}

for (const route of staticRoutes()) {
  test(`${route} has no accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expectNoViolations(page);
  });
}

// Lighthouse only ever sees /lines/ before the piece starts; check the
// controls and info panel that appear once someone interacts with it.
test.describe("/lines/ once started", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lines/");
    // Any click counts as the user gesture that starts the piece.
    await page.mouse.click(10, 10);
    await expect(
      page.getByRole("button", { name: "Record gestures" }),
    ).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
  });

  test("has no accessibility violations", async ({ page }) => {
    await expectNoViolations(page);
  });

  test("info panel has no accessibility violations", async ({ page }) => {
    await page.getByRole("button", { name: "About Lines" }).click();
    await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
    await expectNoViolations(page);
  });
});

// Pages are checked at desktop size above; on phones the header has a menu
// button instead of the nav, and the nav opens over the page.
test.describe("at phone size", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("the header has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    await expectNoViolations(page);
  });

  test("the open menu has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    // Check colours once the links have finished fading in.
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== "running"),
    );
    await expectNoViolations(page);
  });
});
