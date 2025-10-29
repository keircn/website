"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi";

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  parentDelay?: number;
}

export default function ProjectCard({
  project,
  index = 0,
  parentDelay = 0,
}: ProjectCardProps) {
  return (
    <motion.article
      className="border border-border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-all duration-200 hover:shadow-lg group flex flex-col h-full"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: parentDelay + 0.8 + index * 0.15,
        ease: "easeIn",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground group-hover:text-foreground/90 transition-colors">
          {project.title}
        </h3>
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground leading-relaxed h-16 lg:h-12 mb-2 overflow-hidden">
          {project.description}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs mt-auto">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground/80 transition-all decoration-border hover:decoration-foreground/50"
            aria-label="GitHub repository"
          >
            <FaGithub className="w-4 h-4" />
          </Link>
        )}
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground/80 transition-all decoration-border hover:decoration-foreground/50"
            aria-label="Live demo"
          >
            <HiOutlineGlobeAlt className="w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}
