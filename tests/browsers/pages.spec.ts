import { expect, test } from "@playwright/test";
import { staticRoutes } from "../../scripts/static-routes.cjs";
import { collectErrors, hydrated, nav } from "./support";

for (const route of staticRoutes()) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route);
    // Once hydrated, the app's code has run, and any error it hit is in.
    await hydrated(page);

    await expect(nav(page)).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    // Blob loads separately after the page; it always draws a canvas, even
    // when it then explains it can't run.
    if (route === "/blob/") {
      await expect(page.locator("main canvas").first()).toBeAttached();
    }
    // Nothing pokes out sideways, on any screen size.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Some browsers have no WebGL, such as Firefox on CI runners without a
    // GPU. Blob then tells the visitor (and logs why) rather than running.
    const webgl = await page.evaluate(
      () => !!document.createElement("canvas").getContext("webgl"),
    );
    if (route === "/blob/" && !webgl) {
      await expect(
        page.getByText("Your browser can't show this piece: it needs WebGL."),
      ).toBeVisible();
      return;
    }
    expect(errors).toEqual([]);
  });
}
