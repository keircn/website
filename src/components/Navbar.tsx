"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  const items = [
    { href: "/", label: "home" },
    { href: "/projects", label: "projects" },
    { href: "/anilist", label: "anilist" },
    { href: "/contact", label: "contact" },
  ];

  const linkBase =
    "text-sm px-3 py-2 rounded-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-98";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:top-4 md:left-1/2 md:-translate-x-1/2 bg-background/80 backdrop-blur-sm border-b border-border md:border md:rounded-xl">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        <Link
          href="/"
          className="text-xl font-bold text-foreground hover:text-fuchsia-200 transition-all duration-200"
        >
          libkey
        </Link>
        <div className="flex items-center gap-1">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${linkBase} ${
                  active
                    ? "text-foreground bg-accent/30 border border-accent/30 hover:bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/20 bg-accent/10 border-muted/80 border hover:border-accent/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
