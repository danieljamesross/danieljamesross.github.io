This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment

The site is a static export (`output: "export"` in `next.config.ts`), built into
`out/` and published to GitHub Pages by `.github/workflows/deploy.yml` on every
push to `master`. Nothing may depend on a running server: no Server Actions, no
request-reading Route Handlers, no image optimisation.

The contact form is the one exception. GitHub Pages can't receive form posts,
so `netlify-form/` is deployed as a separate, build-less Netlify site that
receives them. Its `submission-created` function emails each one on via
Nodemailer over SMTP (Gmail by default), with Reply-To set to the sender;
it needs `SMTP_USER` and `SMTP_PASS` (a Gmail app password) set in Netlify. Its form definition must keep the same
name and fields as `src/app/(site)/contact/ContactForm.tsx`, and
`CONTACT_FORM_SITE` in that file must match the Netlify site's URL.
