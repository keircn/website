"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { SiAnilist } from "react-icons/si";

interface SocialLinksProps {
  delay?: number;
}

interface SocialLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverColor: string;
}

export default function SocialLinks({ delay = 0 }: SocialLinksProps) {
  const socialLinks: SocialLink[] = [
    {
      href: "/discord",
      label: "Discord",
      icon: FaDiscord,
      hoverColor: "hover:text-indigo-400",
    },
    {
      href: "/gh",
      label: "GitHub",
      icon: FaGithub,
      hoverColor: "hover:text-gray-300",
    },
    {
      href: "/al",
      label: "AniList",
      icon: SiAnilist,
      hoverColor: "hover:text-blue-400",
    },
  ];

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: delay + 0.1 + index * 0.1,
              ease: "easeOut",
            }}
          >
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border text-muted-foreground transition-all duration-300 hover:bg-accent/30 hover:border-accent/50 ${link.hoverColor} hover:scale-105 active:scale-95`}
              aria-label={link.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
