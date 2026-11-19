import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";
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
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/5 dark:bg-white/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 896px) 420px, (min-width: 640px) 50vw, 100vw"
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-semibold tracking-tight">{project.title}</h2>
        <p className="flex-1 text-sm text-black/70 dark:text-white/70">{project.excerpt}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
