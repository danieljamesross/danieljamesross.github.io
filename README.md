# danieljamesross.github.io

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
new pages are covered automatically. In CI the browser tests run in every
engine on Linux, macOS and Windows runners, each as its own job (so a
failure that only happens in Safari on Windows shows up as its own red
check), against one shared build of the site. Lighthouse reports are written to
`.lighthouseci/` and uploaded as a workflow artifact.

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
  `npm run dev` and `npm run build` and writes resized WebP copies to
  `public/_images/` (gitignored), which `src/lib/imageLoader.ts` points
  `next/image` at. Keep images reasonably light: the first projects' images
  are the biggest factor in the home page's Lighthouse performance score.
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
  it never shifts the page.
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
