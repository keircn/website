"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Project } from "~/components/ProjectCard";
import Projects from "~/components/Projects";
import RecentManga from "~/components/RecentManga";

export default function Home() {
  const projects: Project[] = [
    {
      id: "1",
      title: "Archium",
      description: "Archium is a command-line tool for managing packages and more on Arch Linux.",
      githubUrl: "https://github.com/keircn/archium",
    },
    {
      id: "2",
      title: "Linux Dotfiles",
      description:
        "My personal dotfiles managed by GNU stow. Includes Niri, Waybar, Helix, etc.",
      githubUrl: "https://github.com/keircn/dotfiles",
    },
    {
      id: "3",
      title: "Hostman",
      description:
        "Fast, customizable file upload tool with support for any image host you can think of",
      githubUrl: "https://github.com/keircn/hostman",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
      <motion.div
        className="flex flex-row justify-between items-center w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl space-x-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold">
            hi, i&apos;m <span className="text-fuchsia-300">key</span>
          </h1>
          <p className="text-lg font-medium text-neutral-400">dev · 16 · UK</p>
          <p className="text-sm text-neutral-400 mt-4">
            I&apos;m a developer and weeb from the UK. I&apos;ve been using Arch
            for about 2 years and I code sometimes, not that I&apos;m very good
            at it.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            src="/avatar.jpg"
            alt="avatar"
            className="rounded-2xl lg:w-40 sm:w-64"
            width={128}
            height={128}
          />
        </motion.div>
      </motion.div>
      <div className="flex flex-col space-y-4 mt-12 w-full max-w-xl sm:max-w-lg lg:max-w-4xl xl:max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <RecentManga />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Projects projects={projects} />
        </motion.div>
      </div>
    </div>
  );
}
