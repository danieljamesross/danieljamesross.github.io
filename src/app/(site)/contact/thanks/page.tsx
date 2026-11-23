import type { Metadata } from "next";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = {
  title: "Message sent",
  description: "Thanks for contacting Daniel James Ross.",
};

export default function ContactThanksPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Message sent
      </h1>
      <p className="mb-8 max-w-xl text-black/70 dark:text-white/70">
        Thanks for getting in touch. I&apos;ll get back to you soon.
      </p>
      <BackLink href="/">Back to projects</BackLink>
    </div>
  );
}
