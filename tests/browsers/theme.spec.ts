import { expect, test, type Page } from "@playwright/test";
import { finishedTransitions, recordViewTransitions } from "./support";

const LIGHT = "light";
const DARK = "dark";

/** Whether the page's background is light or dark. Browsers write OKLCH
 *  colours back in different forms, so it's painted to a pixel and read. */
const background = (page: Page) =>
  page.evaluate(() => {
    const context = document.createElement("canvas").getContext("2d")!;
    context.fillStyle = getComputedStyle(document.body).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128 ? "light" : "dark";
  });
const toggle = (page: Page) => page.getByRole("button", { name: "Dark mode" });

/** Waits out the theme toggle's reveal, if the browser runs one. */
async function switched(page: Page) {
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-switching",
  );
}

test.describe("with no theme chosen", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`follows a ${scheme} system`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      expect(await background(page)).toBe(scheme === "dark" ? DARK : LIGHT);
      await expect(toggle(page)).toHaveAttribute(
        "aria-pressed",
        String(scheme === "dark"),
      );
    });
  }
});

test("the toggle switches theme and remembers it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await toggle(page).click();
  await switched(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  expect(await background(page)).toBe(DARK);

  // Kept across pages and visits, even against the system setting.
  await page.reload();
  expect(await background(page)).toBe(DARK);
  await page.goto("/cv/");
  expect(await background(page)).toBe(DARK);

  await toggle(page).click();
  await switched(page);
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  expect(await background(page)).toBe(LIGHT);
});

test("a saved theme applies before any app code runs", async ({ page }) => {
  // With the app's scripts blocked, only the inline script in <head> can
  // set the theme, so this shows it doesn't wait for React.
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await background(page)).toBe(DARK);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the theme switches at once, without a reveal", async ({ page }) => {
    await recordViewTransitions(page);
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await toggle(page).click();
    expect(await background(page)).toBe(DARK);
    expect(await finishedTransitions(page)).toEqual([]);
  });
});
