import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Tag from "@/components/Tag";
import { getProject, getProjects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <BackLink href="/">All projects</BackLink>

      <h1 className="mt-4 mb-4 text-3xl font-semibold tracking-tight">
        {project.title}
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      {/* Morphs from the project's card (see ProjectCard). */}
      <ViewTransition
        name={`project-image-${project.slug}`}
        share="morph"
        default="none"
      >
        <div
          data-morph
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-surface"
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            preload
            fetchPriority="high"
          />
        </div>
      </ViewTransition>

      <div
        className="flex max-w-2xl flex-col gap-4 text-foreground [&_a]:underline [&_a]:decoration-accent/40 [&_a]:transition-colors [&_a:hover]:decoration-accent [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        // Rendered at build time from the project's Markdown file in this repo.
        dangerouslySetInnerHTML={{ __html: project.html }}
      />

      {project.links.length > 0 && (
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-sm">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-accent/40 transition-colors hover:decoration-accent"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
