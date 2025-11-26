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
    { href: "/recommendations", label: "recs" },
    { href: "/guestbook", label: "guestbook" },
    { href: "https://blog.keircn.com", label: "blog", external: true },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 md:top-6 md:left-1/2 md:-translate-x-1/2 bg-background/90 backdrop-blur-md border-b border-border/50 md:border md:rounded-2xl md:w-auto md:max-w-fit shadow-lg md:shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-4 sm:gap-8 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="text-base sm:text-lg md:text-xl font-semibold tracking-tight text-foreground hover:text-fuchsia-300 transition-colors duration-200 font-mono"
          >
            LIBKEY
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center gap-1 sm:gap-1.5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        >
          {items.map((item, index) => {
            const active = isActive(item.href);
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
                  className={`relative text-xs sm:text-sm font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "text-foreground bg-accent/40 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-accent/30 rounded-lg border border-border/30"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.nav>
  );
}
