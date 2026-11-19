// Lists every page in the static export (`out/`) as a URL path, e.g.
// "/", "/cv/", "/portfolio/roddart/". Shared by the Lighthouse CI config and
// the accessibility tests so both automatically cover new pages.
const fs = require("node:fs");
const path = require("node:path");

const OUT_DIR = path.join(__dirname, "..", "out");

// Next's error pages aren't real routes.
const EXCLUDED = new Set(["/404/", "/_not-found/"]);

function staticRoutes(dir = OUT_DIR, prefix = "/") {
  if (!fs.existsSync(dir)) {
    throw new Error(`${dir} not found; run \`npm run build\` first`);
  }
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "index.html" && entry.isFile()) routes.push(prefix);
    else if (entry.isDirectory() && entry.name !== "_next") {
      routes.push(
        ...staticRoutes(path.join(dir, entry.name), `${prefix}${entry.name}/`),
      );
    }
  }
  return routes.filter((route) => !EXCLUDED.has(route)).sort();
}

module.exports = { staticRoutes };
