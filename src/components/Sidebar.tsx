"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
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
    { href: "/#about", label: "about" },
    { href: "/#projects", label: "projects" },
    { href: "/anilist", label: "anilist" },
    { href: "/contact", label: "contact" },
  ];

  const linkBase =
    "text-sm px-3 py-2 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

  return (
    <div className="hidden md:block fixed inset-y-0 top-4 left-4 w-48 border rounded-lg border-border bg-backround shadow-sm mb-2.5">
      <div className="flex items-center border-b border-sidebar-border p-3">
        <Link
          href="/"
          className="text-xl font-medium tracking-wide text-sidebar-foreground pl-2.5"
        >
          keiran
        </Link>
      </div>
      <nav
        aria-label="Primary"
        className="flex flex-col gap-1 p-3 overflow-y-auto"
      >
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${linkBase} ${
                active
                  ? "text-sidebar-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
