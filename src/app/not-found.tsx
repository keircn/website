import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <h1 className="text-6xl font-bold text-fuchsia-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-fuchsia-300/20 text-fuchsia-300 border border-fuchsia-300/40 hover:bg-fuchsia-300/30 transition-colors font-medium"
      >
        Go Home
      </Link>
    </div>
  );
}
