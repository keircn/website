"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaDiscord, FaGamepad, FaGithub } from "react-icons/fa";
import { SiAnilist, SiCodeberg } from "react-icons/si";
import { socialLinks as socialConfig } from "~/data/config";

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
      href: socialConfig.discord,
      label: "Discord",
      icon: FaDiscord,
      hoverColor: "hover:text-indigo-400",
    },
    {
      href: socialConfig.github,
      label: "GitHub",
      icon: FaGithub,
      hoverColor: "hover:text-gray-300",
    },
    {
      href: socialConfig.codeberg,
      label: "Codeberg",
      icon: SiCodeberg,
      hoverColor: "hover:text-blue-500",
    },
    {
      href: socialConfig.anilist,
      label: "AniList",
      icon: SiAnilist,
      hoverColor: "hover:text-blue-400",
    },
    {
      href: socialConfig.vndb,
      label: "VNDB",
      icon: FaGamepad,
      hoverColor: "hover:text-foreground",
    },
  ];

  return (
    <motion.div
      className="flex items-center gap-2 -mb-4"
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
              className={`flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border text-muted-foreground transition-all duration-300 hover:bg-accent/30 hover:border-accent/50 ${link.hoverColor} hover:scale-105 active:scale-95`}
              aria-label={link.label}
            >
              <Icon className="w-4 h-4" />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
