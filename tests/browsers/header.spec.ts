import { expect, test, type Page } from "@playwright/test";
import {
  headerState,
  menuButton,
  nav,
  openNav,
  scrollBy,
  settled,
} from "./support";

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
  // The theme toggle is in the header's bottom row on every screen size.
  const toggle = page.getByRole("button", { name: "Dark mode" });
  const hiddenBox = await toggle.boundingBox();
  expect(hiddenBox!.y + hiddenBox!.height).toBeLessThanOrEqual(0);

  await scrollBy(page, -300);
  expect(await headerState(page)).toEqual({ compact: true, hidden: false });
  // The bottom row sits within the bar, and the subtitle has gone.
  const box = await toggle.boundingBox();
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
  await settled(page);
  const title = page.getByRole("link", {
    name: "Daniel James Ross arty codey",
  });
  const box = await title.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  await expect(page.getByText("arty codey")).toHaveCSS("opacity", "1");
});

test("every nav link can be reached", async ({ page }) => {
  const links = (await openNav(page)).getByRole("link");
  await expect(links).toHaveCount(6);
  for (const link of await links.all()) await expect(link).toBeInViewport();
});

test.describe("on wider screens", () => {
  test.skip(({ isMobile }) => isMobile, "wide layout only");

  test("the nav is inline, with no menu", async ({ page }) => {
    await expect(nav(page)).toBeVisible();
    await expect(menuButton(page)).toBeHidden();
  });
});

test.describe("on phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone layout only");

  const menu = (page: Page) => page.getByRole("dialog", { name: "Menu" });

  test("the nav is in a menu", async ({ page }) => {
    await expect(nav(page)).toBeHidden();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");

    await menuButton(page).click();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
    await expect(menu(page)).toBeVisible();
    // Focus starts in the menu, and the page behind is out of reach.
    await expect(menu(page).getByRole("link").first()).toBeFocused();
    await expect(page.locator("main")).toHaveJSProperty("inert", true);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  });

  test("Escape closes it and returns focus to the button", async ({ page }) => {
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(0);
    await expect(menuButton(page)).toBeFocused();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
  });

  test("its button closes it too", async ({ page }) => {
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await menuButton(page).click();
    await expect(menu(page)).toHaveCount(0);
  });

  test("a link goes to its page and closes it", async ({ page }) => {
    await menuButton(page).click();
    await menu(page).getByRole("link", { name: "CV" }).click();
    await expect(page).toHaveURL("/cv/");
    await expect(menu(page)).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "CV", level: 1 }),
    ).toBeVisible();
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
  });

  test("the browser's back button closes it", async ({ page }) => {
    await menuButton(page).click();
    await menu(page).getByRole("link", { name: "CV" }).click();
    await expect(page).toHaveURL("/cv/");
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(menu(page)).toHaveCount(0);
  });

  test("widening the window closes it", async ({ page }) => {
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(menu(page)).toHaveCount(0);
    await expect(nav(page)).toBeVisible();
  });
});
