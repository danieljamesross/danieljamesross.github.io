import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

// Behaviour tests run in each engine. Playwright's "Desktop Safari" and
// iPhone devices use WebKit, the engine Safari is built on; Firefox has no
// mobile emulation, so phones are covered by Chrome and Safari.
const BROWSERS = [
  { name: "chrome", use: devices["Desktop Chrome"] },
  { name: "firefox", use: devices["Desktop Firefox"] },
  { name: "safari", use: devices["Desktop Safari"] },
  { name: "mobile-chrome", use: devices["Pixel 7"] },
  { name: "mobile-safari", use: devices["iPhone 15"] },
];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // A trace (network, console, DOM over time) when a test fails once and
    // is retried, to diagnose failures on CI runners.
    trace: "on-first-retry",
  },
  projects: [
    // Light and dark mode render different colours, so check contrast in
    // both. Accessibility doesn't vary by engine, so Chrome alone is enough.
    {
      name: "light",
      testMatch: "a11y.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
    },
    {
      name: "dark",
      testMatch: "a11y.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
    },
    ...BROWSERS.map((browser) => ({
      ...browser,
      testDir: "tests/browsers",
    })),
  ],
  // Tests run against the static export, as GitHub Pages serves it; run
  // `npm run build` first.
  webServer: {
    command: `npx serve out --listen ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
