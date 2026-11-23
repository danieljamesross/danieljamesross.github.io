// Turns the results CI's jobs upload into one Markdown report, posted as a
// comment on the PR and shown on the run's summary page (see the report job
// in .github/workflows/ci.yml).
//
//   node scripts/ci-report.mjs <dir>
//
// <dir> holds one folder per downloaded artifact:
//   report-browsers-<OS>-<n>/results.json  Playwright JSON, browser tests
//   report-accessibility/results.json      Playwright JSON, axe checks
//   report-lighthouse-<n>/manifest.json    Lighthouse CI's run summary
//
// Environment: NEEDS (the workflow's `needs` context as JSON), RUN_URL, SHA,
// STARTED_AT (ISO time the run started).
import fs from "node:fs";
import path from "node:path";

export const MARKER = "<!-- ci-report -->";

const OSES = ["Linux", "Windows", "macOS"];
const BROWSERS = ["Chrome", "Firefox", "Safari"];
// Playwright project → the browser it counts towards; phones included.
const PROJECT_BROWSER = {
  chrome: "Chrome",
  "mobile-chrome": "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  "mobile-safari": "Safari",
};
const LIGHTHOUSE = [
  // [manifest key, heading, minimum score CI enforces]
  ["performance", "Performance", null],
  ["accessibility", "Accessibility", 1],
  ["best-practices", "Best practices", 1],
  ["seo", "SEO", 1],
];

/** "1 test", "2 tests". */
const count = (n, noun, plural = `${noun}s`) =>
  `${n} ${n === 1 ? noun : plural}`;

const readJson = (file) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;

// Playwright error messages carry terminal colours.
const plain = (text) => text.replace(/\u001b\[[0-9;]*m/g, "");

/** Every test in a Playwright JSON report, flattened. */
function playwrightTests(report) {
  const tests = [];
  const walk = (suite, titles) => {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests) {
        const error = test.results.find((r) => r.error)?.error?.message;
        tests.push({
          project: test.projectName,
          status: test.status, // expected | unexpected | flaky | skipped
          title: [...titles, spec.title].join(" › "),
          file: spec.file,
          error: error && plain(error).split("\n")[0],
        });
      }
    }
    for (const child of suite.suites ?? []) {
      walk(
        child,
        suite.title && !suite.title.endsWith(".ts")
          ? [...titles, suite.title]
          : titles,
      );
    }
  };
  for (const suite of report.suites) walk(suite, []);
  return tests;
}

const tally = (tests) => ({
  passed: tests.filter((t) => t.status === "expected").length,
  flaky: tests.filter((t) => t.status === "flaky").length,
  failed: tests.filter((t) => t.status === "unexpected").length,
  skipped: tests.filter((t) => t.status === "skipped").length,
});

function cell(counts) {
  if (!counts) return "⚪ not run";
  const parts = [];
  if (counts.failed) parts.push(`❌ ${counts.failed} failed`);
  parts.push(`${counts.failed ? "" : "✅ "}${counts.passed} passed`);
  if (counts.flaky) parts.push(`⚠️ ${counts.flaky} flaky`);
  return parts.join(" · ");
}

const scoreBadge = (score) => {
  const n = Math.round(score * 100);
  return `${n >= 90 ? "🟢" : n >= 50 ? "🟠" : "🔴"} ${n}`;
};

const JOB_STATUS = {
  success: "✅ passed",
  failure: "❌ failed",
  cancelled: "⚪ cancelled",
  skipped: "⚪ skipped",
};

function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`;
}

export function buildReport(dir, env = process.env) {
  const folders = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const needs = JSON.parse(env.NEEDS ?? "{}");
  const problems = []; // [kind, message]
  const out = [];

  // Browser tests: one grid cell per OS and browser.
  const grid = {};
  const browserTests = [];
  for (const folder of folders.filter((f) =>
    f.startsWith("report-browsers-"),
  )) {
    const os = folder.split("-")[2];
    const report = readJson(path.join(dir, folder, "results.json"));
    if (!report) continue;
    for (const test of playwrightTests(report)) {
      const browser = PROJECT_BROWSER[test.project];
      if (!browser) continue;
      browserTests.push({ ...test, os, browser, where: `${browser} on ${os}` });
    }
  }
  for (const os of OSES) {
    for (const browser of BROWSERS) {
      const tests = browserTests.filter(
        (t) => t.os === os && t.browser === browser,
      );
      grid[`${os} ${browser}`] = tests.length ? tally(tests) : null;
    }
  }
  const browserTotals = tally(browserTests);
  const missing = Object.values(grid).filter((c) => !c).length;
  if (browserTotals.failed) {
    problems.push([
      "fail",
      `${count(browserTotals.failed, "browser test")} failed`,
    ]);
  }
  if (missing) {
    problems.push([
      "fail",
      `${count(missing, "browser combination")} didn't report`,
    ]);
  }
  if (browserTotals.flaky) {
    problems.push([
      "warn",
      `${count(browserTotals.flaky, "test")} only passed on retry`,
    ]);
  }

  // Accessibility.
  const a11yReport = readJson(
    path.join(dir, "report-accessibility", "results.json"),
  );
  const a11yTests = a11yReport ? playwrightTests(a11yReport) : [];
  const a11y = a11yReport ? tally(a11yTests) : null;
  if (!a11y) problems.push(["fail", "accessibility didn't report"]);
  else if (a11y.failed) {
    problems.push([
      "fail",
      `${count(a11y.failed, "accessibility check")} failed`,
    ]);
  }

  // Lighthouse.
  const pages = folders
    .filter((f) => f.startsWith("report-lighthouse-"))
    .flatMap((f) => readJson(path.join(dir, f, "manifest.json")) ?? [])
    .filter((run) => run.isRepresentativeRun)
    .map((run) => ({ path: new URL(run.url).pathname, summary: run.summary }))
    .sort((a, b) => a.path.localeCompare(b.path));
  for (const [key, heading, minimum] of LIGHTHOUSE) {
    const below = pages.filter((p) => p.summary[key] < (minimum ?? 0.9));
    if (below.length) {
      problems.push([
        minimum ? "fail" : "warn",
        `${heading} below ${(minimum ?? 0.9) * 100} on ${count(below.length, "page")}`,
      ]);
    }
  }
  if (!pages.length) problems.push(["fail", "Lighthouse didn't report"]);

  // Jobs without their own results.
  for (const [job, label] of [
    ["lint", "Lint, format and types"],
    ["build", "Build"],
  ]) {
    const result = needs[job]?.result;
    if (result && result !== "success") {
      problems.push([
        "fail",
        `${label} ${result === "failure" ? "failed" : `was ${result}`}`,
      ]);
    }
  }

  // Headline.
  const failures = problems.filter(([kind]) => kind === "fail");
  const warnings = problems.filter(([kind]) => kind === "warn");
  out.push(MARKER);
  if (failures.length) {
    out.push(`## ❌ ${count(failures.length, "problem")} found`);
  } else if (warnings.length) {
    out.push("## ✅ All checks passed, with warnings");
  } else {
    out.push("## ✅ All checks passed");
  }
  const meta = [];
  if (env.SHA) meta.push(`Commit \`${env.SHA.slice(0, 7)}\``);
  if (env.RUN_URL) meta.push(`[Workflow run](${env.RUN_URL})`);
  if (env.STARTED_AT) {
    meta.push(
      `Finished in ${formatDuration(Date.now() - Date.parse(env.STARTED_AT))}`,
    );
  }
  if (meta.length) out.push("", `<sub>${meta.join(" · ")}</sub>`);
  if (problems.length) {
    out.push("");
    for (const [kind, message] of problems) {
      out.push(`- ${kind === "fail" ? "❌" : "⚠️"} ${message}`);
    }
  }

  // Browser grid.
  out.push(
    "",
    `### 🧪 Browser tests · ${browserTotals.passed + browserTotals.flaky} passed`,
    "",
    `| | ${BROWSERS.join(" | ")} |`,
    `| :-- | ${BROWSERS.map(() => ":--:").join(" | ")} |`,
    ...OSES.map(
      (os) =>
        `| **${os}** | ${BROWSERS.map((b) => cell(grid[`${os} ${b}`])).join(" | ")} |`,
    ),
    "",
    "<sub>Chrome and Safari include phones (Pixel 7, iPhone 15). Safari is " +
      "WebKit, the engine Safari is built on." +
      (browserTotals.skipped
        ? ` ${browserTotals.skipped} tests were skipped where they don't apply, such as hover on phones.`
        : "") +
      "</sub>",
  );

  // Failed tests, with the first line of each error.
  const failedTests = [
    ...browserTests,
    ...a11yTests.map((t) => ({
      ...t,
      where: `Accessibility, ${t.project} mode`,
    })),
  ].filter((t) => t.status === "unexpected");
  if (failedTests.length) {
    out.push(
      "",
      "<details open><summary><b>Failed tests</b></summary>",
      "",
      "| Where | Test | Error |",
      "| :-- | :-- | :-- |",
      ...failedTests.map(
        (t) =>
          `| ${t.where} (\`${t.project}\`) | \`${t.file}\` › ${t.title} | ${(t.error ?? "").replace(/\|/g, "\\|").slice(0, 160)} |`,
      ),
      "",
      "</details>",
    );
  }

  // Accessibility.
  out.push(
    "",
    `### ♿ Accessibility · ${a11y ? cell(a11y) : "⚪ not run"}`,
    "",
    "<sub>axe (WCAG 2.2 AA and best practices) on every page, in light and dark mode.</sub>",
  );

  // Lighthouse: the lowest score per category, then every page.
  if (pages.length) {
    const lowest = (key) => Math.min(...pages.map((p) => p.summary[key]));
    out.push(
      "",
      `### 🔦 Lighthouse · ${pages.length} pages`,
      "",
      `| | ${LIGHTHOUSE.map(([, heading]) => heading).join(" | ")} |`,
      `| :-- | ${LIGHTHOUSE.map(() => ":--:").join(" | ")} |`,
      `| **Lowest** | ${LIGHTHOUSE.map(([key]) => scoreBadge(lowest(key))).join(" | ")} |`,
      "",
      "<sub>Accessibility, best practices and SEO must score 100; " +
        "performance below 90 only warns, as it's simulated and noisy on CI.</sub>",
      "",
      "<details><summary>Every page</summary>",
      "",
      `| Page | ${LIGHTHOUSE.map(([, heading]) => heading).join(" | ")} |`,
      `| :-- | ${LIGHTHOUSE.map(() => ":--:").join(" | ")} |`,
      ...pages.map(
        (p) =>
          `| \`${p.path}\` | ${LIGHTHOUSE.map(([key]) => scoreBadge(p.summary[key])).join(" | ")} |`,
      ),
      "",
      "</details>",
    );
  } else {
    out.push("", "### 🔦 Lighthouse · ⚪ not run");
  }

  // Jobs reported by status only.
  out.push(
    "",
    "### 🧹 Lint, format and types · " +
      (JOB_STATUS[needs.lint?.result] ?? "⚪ not run"),
  );

  return out.join("\n") + "\n";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(buildReport(process.argv[2] ?? "reports"));
}
