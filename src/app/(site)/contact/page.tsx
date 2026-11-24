import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Daniel James Ross.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="mb-8 max-w-xl text-muted">
        Available for commissions, performances, radio production, or private
        tuition. Send a message below and I&apos;ll get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
