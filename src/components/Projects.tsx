"use client";

import { motion } from "motion/react";
import { HiOutlineFolder } from "react-icons/hi";
import ProjectCard, { type Project } from "~/components/ProjectCard";

interface ProjectsProps {
  projects: Project[];
  parentDelay?: number;
}

export default function Projects({ projects, parentDelay = 0 }: ProjectsProps) {
  if (projects.length === 0) {
    return (
      <section id="projects" className="scroll-mt-16">
        <div className="border border-border bg-muted/10 rounded">
          <div className="py-3 border-b border-border flex items-center justify-between mx-4">
            <h3 className="text-lg font-medium text-foreground">My Projects</h3>
            <div className="w-4 h-4 text-muted-foreground">
              <HiOutlineFolder className="w-4 h-4" aria-label="Projects icon" />
            </div>
          </div>
          <div className="p-4">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: parentDelay + 0.4,
                ease: "easeOut",
              }}
            >
              <h3 className="text-lg font-medium text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                Projects showcase will be added here. Check back soon or visit
                my{" "}
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
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="scroll-mt-16">
      <div className="border border-border bg-muted/10 w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl rounded">
        <div className="py-3 border-b border-border flex items-center justify-between mx-4">
          <h3 className="text-lg font-medium text-foreground">My Projects</h3>
          <div className="w-4 h-4 text-muted-foreground">
            <HiOutlineFolder className="w-4 h-4" aria-label="Projects icon" />
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                parentDelay={parentDelay}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
