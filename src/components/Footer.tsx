import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { getVisitorCount, trackVisitor } from "~/app/actions/visitors";

export default async function Footer() {
  await trackVisitor();
  const visitorCount = await getVisitorCount();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/5">
      <div className="flex flex-col items-center w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1800px] mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HiOutlineUsers className="w-4 h-4" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">
                {visitorCount.toLocaleString()}
              </span>{" "}
              {visitorCount === 1 ? "visitor" : "visitors"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/gh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              aria-label="View source on GitHub"
            >
              <FaGithub className="w-4 h-4" aria-hidden="true" />
              <span>Source</span>
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/guestbook"
              className="hover:text-foreground transition-colors"
            >
              Guestbook
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <span>&copy; {currentYear} Key</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
