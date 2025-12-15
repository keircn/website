import type { Project } from "~/components/ProjectCard";

export const projects: Project[] = [
  {
    id: "1",
    title: "Archium",
    description:
      "Archium is a command-line tool for managing packages and more on Arch Linux.",
    githubUrl: "https://github.com/Bestire/archium",
  },
  {
    id: "2",
    title: "ktc",
    description:
      "Keiran's Tiling Compositor, a minimal yet ambitious wayland compositor written in rust with minimal dependencies.",
    githubUrl: "https://github.com/keircn/ktc",
  },
  {
    id: "3",
    title: "ktcbar",
    description:
      "A fast and opinionated status bar for wayland written in Rust. Originally designed for the ktc compositor.",
    githubUrl: "https://github.com/keircn/ktc/tree/main/crates/ktcbar",
  },
  {
    id: "4",
    title: "Hostman",
    description:
      "Fast, customizable file upload tool with support for any image host you can think of",
    githubUrl: "https://github.com/Bestire/hostman",
  },
];
