"use client";

import ProjectCard, { type Project } from "~/components/ProjectCard";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  if (projects.length === 0) {
    return (
      <section id="projects" className="scroll-mt-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
          My Projects
        </h2>
        <div className="border border-border rounded-lg p-6 bg-muted/10 max-w-2xl">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            Projects showcase will be added here. Check back soon or visit my{" "}
            <a
              href="https://github.com/keircn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-foreground/80 transition-all"
            >
              GitHub
            </a>{" "}
            for now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="scroll-mt-16">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
        My Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
