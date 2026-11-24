import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import Tag from "./Tag";

export default function ProjectCard({
  project,
  preload = false,
}: {
  project: Project;
  /** Set for cards visible on first load, so their image isn't lazy-loaded. */
  preload?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      transitionTypes={["nav-forward"]}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm shadow-shadow transition-[border-color,box-shadow,translate] hover:border-accent/50 hover:shadow-lg hover:shadow-shadow motion-safe:hover:-translate-y-1"
    >
      {/* Morphs into the image at the top of the project's page. */}
      <ViewTransition
        name={`project-image-${project.slug}`}
        share="morph"
        default="none"
      >
        <div
          data-morph
          data-motion
          className="relative aspect-video w-full overflow-hidden bg-surface"
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 896px) 420px, (min-width: 640px) 50vw, 100vw"
            preload={preload}
            fetchPriority={preload ? "high" : undefined}
            className="object-cover transition-transform motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent-ink">
          {project.title}
        </h2>
        <p className="flex-1 text-sm text-muted">{project.excerpt}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
