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
    { href: "/#about", label: "~/about" },
    { href: "/#projects", label: "~/projects" },
    { href: "/contact", label: "~/contact" },
  ];

  const linkBase =
    "text-sm px-3 py-2 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="hidden md:block fixed inset-y-0 left-0 w-48 border-r border-border bg-background">
      <div className="flex items-center border-b border-border pb-1.5 p-2">
        <Link href="/" className="text-2xl font-medium font-mono">
          keiran
        </Link>
      </div>
      <nav
        aria-label="Primary"
        className="flex flex-col gap-2 p-2 overflow-y-auto"
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
                  ? "text-foreground bg-muted/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
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
