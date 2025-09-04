"use client";

import Link from "next/link";

export default function Sidebar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-64 border-r border-border">
      <div className="flex items-center border-b border-border pb-1.5 p-2">
        <Link href="/" className="text-2xl font-medium">
          ./keiran.html
        </Link>
      </div>
      <div className="flex flex-col space-y-2 p-2">
        <button
          onClick={() => scrollToSection("about")}
          className="text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
        >
          ~/about
        </button>
        <button
          onClick={() => scrollToSection("projects")}
          className="text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
        >
          ~/projects
        </button>
        <Link
          href="/contact"
          className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
        >
          ~/contact
        </Link>
      </div>
    </div>
  );
}
