# danieljamesross.github.io

[![CI](https://github.com/danieljamesross/danieljamesross.github.io/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/danieljamesross/danieljamesross.github.io/actions/workflows/ci.yml?query=branch%3Amaster)
[![Deploy](https://github.com/danieljamesross/danieljamesross.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/danieljamesross/danieljamesross.github.io/actions/workflows/deploy.yml)
[![Tested in Chrome, Firefox and Safari](https://img.shields.io/badge/tested_in-Chrome_%C2%B7_Firefox_%C2%B7_Safari-4285F4?logo=googlechrome&logoColor=white)](#checks)
[![On Linux, macOS and Windows](https://img.shields.io/badge/on-Linux_%C2%B7_macOS_%C2%B7_Windows-555?logo=githubactions&logoColor=white)](#checks)
[![Lighthouse: 100 for accessibility, best practices and SEO](https://img.shields.io/badge/Lighthouse-100_accessibility_%C2%B7_best_practices_%C2%B7_SEO-0CCE6B?logo=lighthouse&logoColor=white)](#checks)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA-005A9C?logo=w3c&logoColor=white)](#checks)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

Personal site of Daniel James Ross — composer, sound artist and software
engineer. Built with Next.js and TypeScript, exported as static files and
served by GitHub Pages at <https://danieljamesross.github.io>.

| Route                | What it is                                                   |
| -------------------- | ------------------------------------------------------------ |
| `/`                  | Projects, ported from vitruviandan.wordpress.com             |
| `/portfolio/[slug]/` | One page per project                                         |
| `/composition/`      | List of selected works                                       |
| `/lines/`            | _Lines_, an interactive audiovisual piece (p5.js + p5.sound) |
| `/blob/`             | _Blob_, a WebGL blob that plays an AudioWorklet synthesiser  |
| `/cv/`               | CV                                                           |
| `/contact/`          | Contact form (submissions handled by Netlify, see below)     |

## Development

Requires Node 22 (the version CI uses).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

To check the production output as GitHub Pages will serve it, run
`npm run build` and serve `out/` with any static file server, e.g.
`npx serve out`.

## Checks

`.github/workflows/ci.yml` runs these on every pull request. They can all be
run locally too; the last three need `npm run build` first, since they test
the static export in `out/`.

| Command                 | What it checks                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`          | ESLint                                                                                                                                                                                                                                                                                                                                                                    |
| `npm run format:check`  | Prettier formatting (`npm run format` fixes it)                                                                                                                                                                                                                                                                                                                           |
| `npm run typecheck`     | TypeScript                                                                                                                                                                                                                                                                                                                                                                |
| `npm run test:a11y`     | axe (WCAG 2.2 AA plus best practices) on every page, in light and dark mode, and on `/lines/` once started with its info panel open. Uses Playwright; run `npx playwright install chromium` once.                                                                                                                                                                         |
| `npm run test:browsers` | Behaviour in Chrome, Firefox and Safari (WebKit), on desktop and on Chrome and Safari phones: every page loads without errors or sideways overflow, plus the theme toggle, the scrolling header, navigation and page transitions, size-proportional timing and reduced motion. Tests are in `tests/browsers/`; run `npx playwright install chromium firefox webkit` once. |
| `npm run lighthouse`    | Lighthouse on every page. Accessibility, best practices and SEO must score 100; performance below 90 only warns, as it is too noisy on CI to gate on.                                                                                                                                                                                                                     |

The page checks list pages from `out/` via `scripts/static-routes.cjs`, so
new pages are covered automatically.

In CI, one job builds the site and every check that tests it uses that
build:

- **Browser tests** run in every engine on Linux, macOS and Windows runners.
  On Linux and Windows each engine is its own job, so a failure that only
  happens in Safari on Windows shows up as its own red check. macOS runs them
  all in one job, since GitHub's macOS runners are often short of capacity.
  A failing test is retried once with a trace, which is uploaded with the
  results.
- **Lighthouse** splits the pages between three jobs (`LIGHTHOUSE_SHARD`
  in `lighthouserc.cjs`); its reports are uploaded as artifacts.
- **Caching:** `node_modules`, Next's build cache and Playwright's browsers
  are cached between runs (`.github/actions/`).
- **Report:** a last job gathers every job's results into one report
  (`scripts/ci-report.mjs`): a grid of browser tests by OS, accessibility,
  Lighthouse scores for every page, and any failures with their errors. It's
  shown on the run's summary page and posted as a comment on the PR, which
  each push updates rather than adding another.

## Editing content

### Projects (Pages CMS)

Each project is a Markdown file in `src/content/projects/`, edited through
[Pages CMS](https://pagescms.org) at <https://app.pagescms.org> (sign in with
GitHub; it needs its GitHub app installed on this repository). Saving in the
CMS commits to the repository, which redeploys the site.

- **Fields** are defined in `.pages.yml` and validated at build time by
  `src/lib/projects.ts`. Keep the two in step. An invalid file fails the
  build with a message naming the file and field, and the live site stays
  as it was.
- **Order:** projects are listed by `date`, most recent first. The dates
  migrated from WordPress are approximations (the month the image was
  uploaded), so correct them as needed.
- **URLs:** the filename is the URL, `/portfolio/<filename>/`. Renaming a
  file changes its URL.
- **Images** are uploaded to `src/assets/images/` and referenced as
  `/images/<name>`. `scripts/optimize-images.mjs` runs before every
  `npm run dev` and `npm run build` and writes resized AVIF copies to
  `public/_images/` (gitignored), which `src/lib/imageLoader.ts` points
  `next/image` at. Images are always shown cropped to 16:9, so the copies
  are cropped to their middle 16:9 too: frame the subject there. Keep images
  reasonably light: the first project's image is the biggest factor in the
  home page's Lighthouse performance score.
- **Text** is Markdown. Images can't be placed inside the text.

### Everything else

- **Compositions:** `src/lib/data.ts`
- **CV:** `src/lib/cv.ts`
- **Header navigation:** `src/components/SiteHeader.tsx`

## Project layout

```
src/
  app/
    (site)/          pages that share the site header and footer
    lines/           the Lines route (adds the site header, its own font and styles)
    blob/            the Blob route
  assets/images/     project images (uploaded through Pages CMS)
  components/        shared site components (header, theme toggle, page transitions)
  content/projects/  one Markdown file per project
  lib/               site content (data.ts, cv.ts) and project loading
  lines/             the Lines piece: React components, p5 sketches, state, SCSS
  blob/              the Blob piece: React components, WebGL scene, synth
public/audio/        audio used by Lines
public/worklets/     AudioWorklet processors, served as plain files
netlify-form/        separate Netlify site that receives contact form posts
scripts/             build and CI helpers (image optimisation, page discovery)
```

### Lines

_Lines_ is entirely client-side. A few things are deliberate and easy to
break:

- `MainSection` (the only importer of p5.sound) is loaded with
  `next/dynamic` only after the piece starts, because p5.sound creates an
  AudioContext on import and browsers block that before a user gesture.
- `whenSoundReady()` in `src/lines/lib/sketches/p5Sound.ts` boots one
  throwaway p5 instance before the real sketches, so p5.sound registers its
  AudioWorklet processors once instead of once per sketch.
- `P5Canvas` never calls `remove()` on a sketch torn down mid-preload:
  p5.sound's remove hook disposes _every_ sketch's sounds.

### Blob

_Blob_ is also entirely client-side, with no dependencies beyond React:

- `blobScene.ts` ray-marches the blob in a WebGL fragment shader
  (`shaders.ts`) and runs its spring physics and pointer handling. Its
  `UV_TO_WORLD` must match `CAM_Z / FOCAL` in the shader.
- The synth is generated sample by sample in
  `public/worklets/saw-synth-processor.js`, an AudioWorklet that lives in
  `public/` so it's served as-is rather than bundled. `blobSynth.ts` sets its
  parameters from the blob and analyses its output; the spectrum is drawn
  over the blob by `spectrumOverlay.ts` and passed to the shader to colour it.
- Ray-marching costs per pixel, and phones' GPUs vary enormously, so the
  resolution adapts (`adaptiveResolution.ts`): it drops while frames come
  slower than the display refreshes and climbs back when there's headroom.
  Touch screens also start from at most 1.5× their pixel ratio.

### Motion and themes

- **Timing scales with size.** Every transition and animation lasts a
  minimum time plus a fixed amount per pixel of the moving element's
  diagonal, up to a cap. The numbers are `--motion-*` in
  `src/app/globals.css`. `MotionSizer` measures every link, button and
  `data-motion` element and sets its `--motion-size`, which feeds Tailwind's
  default transition duration, so plain `transition-*` utilities follow the
  rule. Script-driven animations use `motionDuration()` in
  `src/lib/motion.ts`.
- **Page transitions** use React's `<ViewTransition>` (`PageTransition`).
  Header links tag each navigation `nav-forward` or `nav-back` by nav order;
  a project's image morphs between its card and its page. A
  `<ViewTransition>` only animates when nothing above it is also being
  added or removed, which is why it wraps both the `(site)` template's page
  and each layout's `<main>`.
- **The header** only ever moves with transforms, so compacting and hiding
  it never shifts the page. On phones the nav moves into `MobileMenu`, a
  full-screen panel that grows out of the menu button; while it's open the
  page behind is inert and Escape closes it.
- **Themes:** with no choice saved, the site follows the system. The toggle
  saves one to `localStorage`, and `ThemeScript` applies it before the first
  paint. `dark:` utilities are redefined in `globals.css` to follow both.

## Deployment

### Site → GitHub Pages

`next.config.ts` sets `output: "export"` and `trailingSlash: true`, so every
route becomes a plain `index.html`. `.github/workflows/deploy.yml` builds
`out/` and publishes it to GitHub Pages on every push to `master`.

Because the site is static, nothing may depend on a running server: no
Server Actions, no Route Handlers that read the request, no `next/image`
optimisation (images are served `unoptimized`).

Repository settings this relies on:

- **Settings → Pages → Source:** GitHub Actions
- **Settings → Environments → github-pages:** `master` allowed to deploy

### Contact form → Netlify

GitHub Pages can't receive form posts, so the form in
`src/app/(site)/contact/ContactForm.tsx` posts to a separate, build-less
Netlify site deployed from `netlify-form/`:

1. Netlify Forms accepts the post (its spam filtering and the `bot-field`
   honeypot drop junk) and serves `netlify-form/thanks/`, which redirects
   back to `/contact/thanks/` on the main site.
2. Netlify then runs `netlify-form/netlify/functions/submission-created.mjs`,
   which emails the message on with Nodemailer over SMTP, with Reply-To set
   to the visitor.

Keep these in sync when changing the form:

- The form name and field names in `ContactForm.tsx` must match the hidden
  form definition in `netlify-form/index.html`, which is what Netlify
  detects at deploy time.
- `CONTACT_FORM_SITE` in `ContactForm.tsx` must match the Netlify site's URL.

#### Netlify setup

- **Base directory:** `netlify-form` (build settings come from its
  `netlify.toml`)
- **Branch:** `master`
- **Forms:** form detection enabled, then redeploy so the `contact` form is
  registered

Environment variables (Project configuration → Environment variables):

| Variable                  | Required | Value                                                                                                  |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `SMTP_USER`               | yes      | Gmail address that sends the email                                                                     |
| `SMTP_PASS`               | yes      | Gmail app password, created at <https://myaccount.google.com/apppasswords> (needs 2-Step Verification) |
| `CONTACT_TO_EMAIL`        | no       | Where messages go; defaults to `SMTP_USER`                                                             |
| `SMTP_HOST` / `SMTP_PORT` | no       | Defaults to `smtp.gmail.com` / `465`; set these to use another SMTP provider                           |

Google revokes app passwords whenever the account password changes, so if
emails stop arriving, create a new one and update `SMTP_PASS`. Delivery
errors show up in Netlify under **Logs → Functions → submission-created**.
