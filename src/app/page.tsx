import Link from "next/link";

export default function Home() {
  return (
    <div className="font-mono min-h-screen flex text-foreground bg-background">
      <div className="w-64 border-r border-border">
        <div className="flex items-center mb-8 border-b border-border pb-1.5 p-2">
          <Link href="/" className="text-3xl font-medium">
            tuxbkt_
          </Link>
        </div>
      </div>
      <div className="flex-1 p-2">
        <div className="text-sm text-muted-foreground"></div>
      </div>
    </div>
  );
}
