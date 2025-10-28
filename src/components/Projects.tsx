"use client";

import { motion } from "motion/react";
import ProjectCard, { type Project } from "~/components/ProjectCard";

interface ProjectsProps {
  projects: Project[];
  parentDelay?: number;
}

export default function Projects({ projects, parentDelay = 0 }: ProjectsProps) {
  if (projects.length === 0) {
    return (
      <motion.section
        id="projects"
        className="scroll-mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="border border-border bg-muted/10 rounded"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="py-3 border-b border-border flex items-center justify-between mx-4">
            <h3 className="text-lg font-medium text-foreground">My Projects</h3>
            <div className="w-4 h-4 text-muted-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="Projects icon"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
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
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="projects"
      className="scroll-mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="border border-border bg-muted/10 w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl rounded"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="py-3 border-b border-border flex items-center justify-between mx-4">
          <h3 className="text-lg font-medium text-foreground">My Projects</h3>
          <div className="w-4 h-4 text-muted-foreground">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Projects icon"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
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
      </motion.div>
    </motion.section>
  );
}
