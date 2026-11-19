// The site is a static export on GitHub Pages, so submissions go to a tiny
// separate Netlify site (see `netlify-form/`) whose form handler emails them
// on. Field names must match the form definition in netlify-form/index.html.
export const CONTACT_FORM_SITE = "https://danieljamesross-contact.netlify.app";

const LABEL_CLASS = "mb-1 block font-mono text-sm text-black/60 dark:text-white/50";

const INPUT_CLASS =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-black/50 dark:border-white/20 dark:focus:border-white/60";

export default function ContactForm() {
  return (
    <form
      name="contact"
      method="POST"
      action={`${CONTACT_FORM_SITE}/thanks/`}
      className="flex max-w-xl flex-col gap-5"
    >
      {/* Tells Netlify which of its registered forms this submission is for. */}
      <input type="hidden" name="form-name" value="contact" />

      <div>
        <label htmlFor="name" className={LABEL_CLASS}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={200}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="email" className={LABEL_CLASS}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          maxLength={320}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          className={INPUT_CLASS}
        />
      </div>

      {/* Honeypot for bots; Netlify drops any submission that fills it in. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="bot-field">Leave this empty</label>
        <input type="text" id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button
          type="submit"
          className="rounded-md border border-black/80 px-4 py-2 font-mono text-sm transition-colors hover:bg-black hover:text-white dark:border-white/80 dark:hover:bg-white dark:hover:text-black"
        >
          Send message
        </button>
      </div>
    </form>
  );
}
