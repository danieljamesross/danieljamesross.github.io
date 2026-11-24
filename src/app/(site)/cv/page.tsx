import type { Metadata } from "next";
import type { ReactNode } from "react";
import Tag from "@/components/Tag";
import {
  cvEducation,
  cvExperience,
  cvHeadline,
  cvLinks,
  cvSkills,
  cvSummary,
} from "@/lib/cv";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV of Daniel James Ross — senior software engineer working in TypeScript, React and Node.",
};

const LINK_CLASS =
  "underline decoration-accent/40 transition-colors hover:decoration-accent";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 border-b border-line pb-2 font-mono text-sm uppercase tracking-wide text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">CV</h1>
      <p className="mb-6 text-muted">{cvHeadline}</p>

      <div className="flex max-w-2xl flex-col gap-4 text-muted">
        {cvSummary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-6 font-mono text-sm">
        <li>London, UK</li>
        {cvLinks.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <Section title="Experience">
        <ol className="flex flex-col gap-8">
          {cvExperience.map((job) => (
            <li
              key={job.company}
              className="border-b border-line pb-8 last:border-b-0"
            >
              <h3 className="text-lg font-medium">{job.company}</h3>
              <ol className="mt-3 flex flex-col gap-5">
                {job.roles.map((role) => (
                  <li key={role.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="font-medium text-foreground">
                        {role.title}
                      </h4>
                      <span className="font-mono text-sm text-muted">
                        {role.dates}
                      </span>
                    </div>
                    {role.points.length === 1 ? (
                      <p className="mt-1 text-sm text-muted">
                        {role.points[0]}
                      </p>
                    ) : (
                      <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted marker:text-faint">
                        {role.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Skills">
        <dl className="flex flex-col gap-6">
          {cvSkills.map((group) => (
            <div key={group.label}>
              <dt className="mb-2 text-sm font-medium">{group.label}</dt>
              <dd className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Education">
        <ol className="flex flex-col gap-4">
          {cvEducation.map((item) => (
            <li
              key={item.qualification}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <div>
                <h3 className="font-medium">{item.qualification}</h3>
                <p className="text-sm text-muted">{item.institution}</p>
              </div>
              <span className="font-mono text-sm text-muted">{item.dates}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
