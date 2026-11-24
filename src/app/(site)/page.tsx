import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-10 max-w-2xl text-muted">
        Composer, improviser, and sound artist working across electronics,
        algorithmic composition, and live performance. A selection of projects,
        collaborations, and commissions.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {getProjects().map((project, i) => (
          // The first card is the largest thing above the fold on every
          // layout. Its neighbour on wider screens is the same size, so it
          // can't become the LCP, and preloading it would only take
          // bandwidth from the one that is.
          <ProjectCard key={project.slug} project={project} preload={i === 0} />
        ))}
      </div>
    </div>
  );
}
