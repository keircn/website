"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "~/app/actions/admin";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-accent/20 text-muted-foreground border border-border/40 hover:border-red-400/40 hover:text-red-400 transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/recommendations"
            className="group p-6 rounded-xl bg-accent/20 border border-border/40 hover:border-fuchsia-300/40 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-300/10"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-fuchsia-300 transition-colors">
              Manage Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Add, edit, or remove anime, manga, light novel, and visual novel
              recommendations.
            </p>
          </Link>

          <Link
            href="/admin/guestbook"
            className="group p-6 rounded-xl bg-accent/20 border border-border/40 hover:border-fuchsia-300/40 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-300/10"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-fuchsia-300 transition-colors">
              Moderate Guestbook
            </h2>
            <p className="text-sm text-muted-foreground">
              Review and manage guestbook entries, delete spam or inappropriate
              messages.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
