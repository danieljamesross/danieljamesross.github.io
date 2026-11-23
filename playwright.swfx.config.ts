import base from "./playwright.config";
export default {
  ...base,
  retries: 0,
  projects: [{ name: "firefox-software", testDir: "tests/browsers", use: { browserName: "firefox", launchOptions: { firefoxUserPrefs: { "gfx.webrender.software": true, "layers.acceleration.disabled": true, "gfx.canvas.accelerated": false } } } }],
};
