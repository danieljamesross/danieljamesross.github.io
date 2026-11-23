import { expect, test } from "@playwright/test";
import { staticRoutes } from "../../scripts/static-routes.cjs";
import { collectErrors, nav } from "./support";

for (const route of staticRoutes()) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    await expect(nav(page)).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    // Nothing pokes out sideways, on any screen size.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
