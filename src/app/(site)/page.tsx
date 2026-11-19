import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-10 max-w-2xl text-black/70 dark:text-white/70">
        Composer, improviser, and sound artist working across electronics,
        algorithmic composition, and live performance. A selection of
        projects, collaborations, and commissions.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
