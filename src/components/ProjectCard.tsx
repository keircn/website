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
      className="border border-border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-[background-color,box-shadow] duration-300 hover:shadow-lg group flex flex-col h-full will-change-transform"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -4,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      }}
      transition={{
        duration: 0.5,
        delay: parentDelay + index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground group-hover:text-foreground/90 transition-colors">
          {project.title}
        </h3>
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-2">
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
