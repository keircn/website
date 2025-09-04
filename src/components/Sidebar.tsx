import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-48 border-r border-border bg-background">
      <div className="flex items-center border-b border-border pb-1.5 p-2">
        <Link href="/" className="text-2xl font-medium font-mono">
          keiran
        </Link>
      </div>
      <div className="flex flex-col space-y-2 p-2">
        <Link
          href="/#about"
          className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
        >
          ~/about
        </Link>
        <Link
          href="/#projects"
          className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
        >
          ~/projects
        </Link>
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
