import { expect, test } from "@playwright/test";
import { headerState, nav, scrollBy } from "./support";

// The compact bar's height (--bar in globals.css).
const BAR = 56;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("is full size at the top of the page", async ({ page }) => {
  expect(await headerState(page)).toEqual({ compact: false, hidden: false });
  await expect(page.getByText("arty codey")).toBeVisible();
});

test("hides while scrolling down and returns as a bar on scrolling up", async ({
  page,
}) => {
  await scrollBy(page, 1200);
  expect(await headerState(page)).toEqual({ compact: true, hidden: true });
  const projects = nav(page).getByRole("link", { name: "Projects" });
  const hiddenBox = await projects.boundingBox();
  expect(hiddenBox!.y + hiddenBox!.height).toBeLessThanOrEqual(0);

  await scrollBy(page, -300);
  expect(await headerState(page)).toEqual({ compact: true, hidden: false });
  // The nav sits within the bar, and the subtitle has gone.
  const box = await projects.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(BAR);
  await expect(page.getByText("arty codey")).toHaveCSS("opacity", "0");

  await scrollBy(page, -5000);
  expect(await headerState(page)).toEqual({ compact: false, hidden: false });
});

test("moving it never shifts the page", async ({ page }) => {
  const heading = page.getByRole("heading", { name: "Giant Leap" });
  const before = await heading.evaluate(
    (el) => el.getBoundingClientRect().top + scrollY,
  );
  await scrollBy(page, 600);
  await scrollBy(page, -200);
  const after = await heading.evaluate(
    (el) => el.getBoundingClientRect().top + scrollY,
  );
  expect(after).toBe(before);
});

test("keyboard focus brings it back in full", async ({ page }) => {
  await scrollBy(page, 1200);
  expect((await headerState(page)).hidden).toBe(true);
  const focusInHeader = () =>
    page.evaluate(() => !!document.activeElement?.closest(".site-header"));
  // Which keys reach links varies: Safari on macOS only tabs to them with
  // Option held, WebKit elsewhere with plain Tab.
  for (const key of ["Tab", "Alt+Tab"]) {
    await page.keyboard.press(key);
    if (await focusInHeader()) break;
  }
  expect(await focusInHeader()).toBe(true);
  await page.waitForTimeout(800);
  const title = page.getByRole("link", {
    name: "Daniel James Ross arty codey",
  });
  const box = await title.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  await expect(page.getByText("arty codey")).toHaveCSS("opacity", "1");
});

test("every nav link can be reached", async ({ page }) => {
  for (const link of await nav(page).getByRole("link").all()) {
    // On phones the nav scrolls sideways.
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport();
  }
});

test.describe("on phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone layout only");

  test("the nav scrolls sideways instead of wrapping", async ({ page }) => {
    const box = await nav(page).boundingBox();
    const contact = nav(page).getByRole("link", { name: "Contact" });
    const contactBox = await contact.boundingBox();
    // One row, running past the right edge.
    expect(contactBox!.y).toBeLessThan(box!.y + box!.height);
    expect(contactBox!.x + contactBox!.width).toBeGreaterThan(
      page.viewportSize()!.width,
    );
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeInViewport({ ratio: 1 });
  });
});
