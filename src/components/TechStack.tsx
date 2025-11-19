"use client";

import { motion } from "motion/react";
import {
  SiDrizzle,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const technologies = [
  { name: "Next.js", icon: SiNextdotjs, color: "hover:text-white" },
  { name: "React", icon: SiReact, color: "hover:text-[#61DAFB]" },
  { name: "TypeScript", icon: SiTypescript, color: "hover:text-[#3178C6]" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "hover:text-[#06B6D4]" },
  { name: "Drizzle ORM", icon: SiDrizzle, color: "hover:text-[#C5F74F]" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "hover:text-[#4169E1]" },
];

export default function TechStack() {
  return (
    <section className="w-full py-8">
      <h2 className="text-xl font-semibold mb-6">Tech Stack</h2>
      <div className="flex flex-wrap gap-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-4 py-2 bg-accent/10 border border-border rounded-lg text-muted-foreground transition-colors duration-300 ${tech.color}`}
          >
            <tech.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
