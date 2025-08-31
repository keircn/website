import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-border">
      <div className="flex items-center mb-8 border-b border-border pb-1.5 p-2">
        <Link href="/" className="text-3xl font-medium">
          /tuxbkt/
        </Link>
      </div>
    </div>
  );
}
