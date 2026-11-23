// Lighthouse CI: audits every page of the static export (run `npm run build`
// first). Accessibility, best practices and SEO must score 100. Performance
// only warns: it is simulated on noisy CI machines and swings by several
// points between runs, and image-led pages sit around 97 on mobile because of
// the size of the Next.js runtime.
const { staticRoutes } = require("./scripts/static-routes.cjs");

const PORT = 4173;

// CI splits the pages between parallel jobs: LIGHTHOUSE_SHARD="2/3" audits
// the second of three shares. Unset, it audits every page.
const [shard, shards] = (process.env.LIGHTHOUSE_SHARD ?? "1/1")
  .split("/")
  .map(Number);
const routes = staticRoutes().filter((_, i) => i % shards === shard - 1);

module.exports = {
  ci: {
    collect: {
      // `serve` gzips responses, which is closer to GitHub Pages than a
      // plain static server.
      startServerCommand: `npx serve out --listen ${PORT} --no-clipboard`,
      startServerReadyPattern: "Accepting connections",
      url: routes.map((route) => `http://localhost:${PORT}${route}`),
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "categories:performance": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
