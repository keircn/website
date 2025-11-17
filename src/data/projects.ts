import type { Project } from "~/components/ProjectCard";

export const projects: Project[] = [
  {
    id: "1",
    title: "Archium",
    description:
      "Archium is a command-line tool for managing packages and more on Arch Linux.",
    githubUrl: "https://github.com/keircn/archium",
  },
  {
    id: "2",
    title: "Linux Dotfiles",
    description:
      "My personal dotfiles managed by GNU stow. Includes Hyprland, Waybar, Ghostty, etc.",
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
