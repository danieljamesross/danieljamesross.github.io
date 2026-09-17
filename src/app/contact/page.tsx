import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Daniel James Ross.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="max-w-xl text-black/70 dark:text-white/70">
        Available for commissions, performances, radio production, or private
        tuition. Get in touch by email or on Twitter.
      </p>
      <dl className="mt-8 flex flex-col gap-4 font-mono text-sm">
        <div className="flex gap-3">
          <dt className="text-black/50 dark:text-white/50">Email</dt>
          <dd>
            <a
              href="mailto:mr.danielross@gmail.com"
              className="underline decoration-black/30 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white"
            >
              mr.danielross [at] gmail.com
            </a>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-black/50 dark:text-white/50">Twitter</dt>
          <dd>
            <a
              href="https://twitter.com/danieljamesross"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/30 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white"
            >
              @danieljamesross
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
