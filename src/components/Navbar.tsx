"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && hash === href.slice(1);
    }
    return pathname === href;
  };

  const items: NavItem[] = [
    { href: "/", label: "home" },
    { href: "/discord", label: "Discord", external: true },
    { href: "/gh", label: "GitHub", external: true },
    { href: "/al", label: "AniList", external: true },
    // { href: "/projects", label: "projects" },
    // { href: "/anilist", label: "anilist" },
    // { href: "/contact", label: "contact" },
  ];

  const linkBase =
    "text-sm px-3 py-2 rounded-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-98";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 md:top-4 md:left-1/2 md:-translate-x-1/2 bg-background/80 backdrop-blur-sm border-b border-border md:border md:rounded-xl md:w-auto lg:w-[900px] xl:w-[1200px]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-4 py-4 pb-3 md:px-4 md:pl-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="text-xl font-medium text-foreground hover:text-fuchsia-200 transition-all duration-200 font-mono"
          >
            LIBKEY
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 -mt-1.5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        >
          {items.map((item, index) => {
            const active = isActive(item.href);
            const shouldUseActiveStyle = active || item.external;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.4 + index * 0.05,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`${linkBase} ${
                    shouldUseActiveStyle
                      ? "text-foreground bg-accent/30 border border-accent/30 hover:bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/20 bg-accent/10 border-muted/80 border hover:border-accent/30"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.nav>
  );
}
