import { expect, test, type Locator, type Page } from "@playwright/test";
import { nav } from "./support";

// Hover doesn't exist on touch screens.
test.skip(({ isMobile }) => isMobile, "needs a mouse");

/** The duration the motion rule gives something `size` px across, in ms. */
async function expectedDuration(page: Page, size: number) {
  return page.evaluate((size) => {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string) => parseFloat(style.getPropertyValue(name));
    return Math.min(
      Math.max(
        token("--motion-base") + size * token("--motion-rate"),
        token("--motion-base"),
      ),
      token("--motion-max"),
    );
  }, size);
}

/** An element's diagonal and its first transition's duration, in ms. */
async function motionOf(element: Locator) {
  return element.evaluate((el) => {
    const { width, height } = el.getBoundingClientRect();
    return {
      size: Math.hypot(width, height),
      measured: parseFloat(
        (el as HTMLElement).style.getPropertyValue("--motion-size"),
      ),
      duration: parseFloat(getComputedStyle(el).transitionDuration) * 1000,
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // MotionSizer runs once the page has hydrated.
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--page-size"),
      ),
    )
    .not.toBe("");
});

test("transitions take longer the bigger the element", async ({ page }) => {
  const link = await motionOf(nav(page).getByRole("link", { name: "CV" }));
  const card = await motionOf(page.getByRole("link", { name: /^Giant Leap/ }));
  const header = await motionOf(page.locator(".site-header"));

  for (const element of [link, card, header]) {
    // Measured by MotionSizer...
    expect(element.measured).toBeCloseTo(element.size, -1);
    // ...and timed by the rule.
    expect(element.duration).toBeCloseTo(
      await expectedDuration(page, element.measured),
      0,
    );
  }
  expect(link.duration).toBeLessThan(card.duration);
  expect(card.duration).toBeLessThan(header.duration);
});

test("page transitions are timed by the viewport", async ({ page }) => {
  const { size, duration } = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.transitionDuration = "var(--page-duration)";
    document.body.append(probe);
    const duration = parseFloat(getComputedStyle(probe).transitionDuration);
    probe.remove();
    return {
      size: parseFloat(
        document.documentElement.style.getPropertyValue("--page-size"),
      ),
      duration: duration * 1000,
    };
  });
  const viewport = page.viewportSize()!;
  expect(size).toBeCloseTo(Math.hypot(viewport.width, viewport.height), -1);
  expect(duration).toBeCloseTo(await expectedDuration(page, size), 0);
});

test("cards lift on hover", async ({ page }) => {
  const card = page.getByRole("link", { name: /^Giant Leap/ });
  await card.hover();
  await expect(card).not.toHaveCSS("translate", "none");
  await page.mouse.move(0, 0);
  await expect(card).toHaveCSS("translate", "none");
});

test("nav links underline on hover", async ({ page }) => {
  const link = nav(page).getByRole("link", { name: "CV" });
  const underline = () =>
    link.evaluate((el) => getComputedStyle(el, "::after").scale);
  expect(await underline()).toMatch(/^0 1$|^0$/);
  await link.hover();
  await expect.poll(underline).toMatch(/^1$|^none$|^1 1$/);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("cards don't move on hover", async ({ page }) => {
    const card = page.getByRole("link", { name: /^Giant Leap/ });
    await card.hover();
    await page.waitForTimeout(400);
    await expect(card).toHaveCSS("translate", "none");
  });
});
