# danieljamesross.github.io

Personal site of Daniel James Ross — composer, sound artist and software
engineer. Built with Next.js and TypeScript, exported as static files and
served by GitHub Pages at <https://danieljamesross.github.io>.

| Route | What it is |
|---|---|
| `/` | Projects, ported from vitruviandan.wordpress.com |
| `/portfolio/[slug]/` | One page per project |
| `/composition/` | List of selected works |
| `/lines/` | *Lines*, an interactive audiovisual piece (p5.js + p5.sound) |
| `/cv/` | CV |
| `/contact/` | Contact form (submissions handled by Netlify, see below) |

## Development

Requires Node 22 (the version CI uses).

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export into out/
```

To check the production output as GitHub Pages will serve it, run
`npm run build` and serve `out/` with any static file server, e.g.
`npx serve out`.

## Editing content

Most content is plain data rather than markup:

- **Projects and compositions:** `src/lib/data.ts`
- **CV:** `src/lib/cv.ts`
- **Header navigation:** `src/components/SiteHeader.tsx`

## Project layout

```
src/
  app/
    (site)/        pages that share the site header and footer
    lines/         the Lines route (adds the site header, its own font and styles)
  components/      shared site components
  lib/             site content (data.ts, cv.ts)
  lines/           the Lines piece: React components, p5 sketches, state, SCSS
public/audio/      audio used by Lines
netlify-form/      separate Netlify site that receives contact form posts
```

### Lines

*Lines* is entirely client-side. A few things are deliberate and easy to
break:

- `MainSection` (the only importer of p5.sound) is loaded with
  `next/dynamic` only after the piece starts, because p5.sound creates an
  AudioContext on import and browsers block that before a user gesture.
- `whenSoundReady()` in `src/lines/lib/sketches/p5Sound.ts` boots one
  throwaway p5 instance before the real sketches, so p5.sound registers its
  AudioWorklet processors once instead of once per sketch.
- `P5Canvas` never calls `remove()` on a sketch torn down mid-preload:
  p5.sound's remove hook disposes *every* sketch's sounds.

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

| Variable | Required | Value |
|---|---|---|
| `SMTP_USER` | yes | Gmail address that sends the email |
| `SMTP_PASS` | yes | Gmail app password, created at <https://myaccount.google.com/apppasswords> (needs 2-Step Verification) |
| `CONTACT_TO_EMAIL` | no | Where messages go; defaults to `SMTP_USER` |
| `SMTP_HOST` / `SMTP_PORT` | no | Defaults to `smtp.gmail.com` / `465`; set these to use another SMTP provider |

Google revokes app passwords whenever the account password changes, so if
emails stop arriving, create a new one and update `SMTP_PASS`. Delivery
errors show up in Netlify under **Logs → Functions → submission-created**.
