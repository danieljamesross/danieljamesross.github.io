import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Tag from "@/components/Tag";
import { getProject, projects } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
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
      <Link
        href="/"
        className="font-mono text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
      >
        ← All projects
      </Link>

      <h1 className="mt-4 mb-4 text-3xl font-semibold tracking-tight">
        {project.title}
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          preload
          fetchPriority="high"
        />
      </div>

      <div className="flex max-w-2xl flex-col gap-4 text-black/80 dark:text-white/80">
        {project.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 font-mono text-sm dark:border-white/15">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/30 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
