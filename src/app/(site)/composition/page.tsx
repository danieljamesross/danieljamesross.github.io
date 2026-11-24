import type { Metadata } from "next";
import { compositions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Composition",
  description: "A list of selected works by Daniel James Ross, 2010–2018.",
};

export default function CompositionPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Composition
      </h1>
      <p className="mb-10 text-muted">List of selected works.</p>
      <ol className="flex flex-col gap-6">
        {compositions.map((work) => (
          <li
            key={work.title}
            className="border-b border-line pb-6 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-medium">{work.title}</h2>
              <span className="font-mono text-sm text-muted">{work.year}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{work.description}</p>
            {work.scoreUrl && (
              <a
                href={work.scoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-sm underline decoration-accent/40 transition-colors hover:decoration-accent"
              >
                View score →
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
