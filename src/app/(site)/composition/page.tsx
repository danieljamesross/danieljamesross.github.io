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
      <p className="mb-10 text-black/70 dark:text-white/70">
        List of selected works.
      </p>
      <ol className="flex flex-col gap-6">
        {compositions.map((work) => (
          <li
            key={work.title}
            className="border-b border-black/10 pb-6 last:border-b-0 dark:border-white/15"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-medium">{work.title}</h2>
              <span className="font-mono text-sm text-black/60 dark:text-white/50">
                {work.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              {work.description}
            </p>
            {work.scoreUrl && (
              <a
                href={work.scoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-sm underline decoration-black/30 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white"
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
