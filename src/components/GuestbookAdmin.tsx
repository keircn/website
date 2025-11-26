"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteGuestbookEntry } from "~/app/actions/guestbook";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
  ipAddress?: string | null;
};

type GuestbookAdminProps = {
  initialEntries: GuestbookEntry[];
};

export default function GuestbookAdmin({
  initialEntries,
}: GuestbookAdminProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setLoading(true);
    const result = await deleteGuestbookEntry(id);

    if (result.success) {
      setEntries(entries.filter((e) => e.id !== id));
    } else {
      alert(result.error || "Failed to delete entry");
    }
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Moderate Guestbook</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No guestbook entries yet.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-accent/20 border border-border/40"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{entry.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    {entry.ipAddress && (
                      <span className="text-xs text-muted-foreground">
                        IP: {entry.ipAddress}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-foreground">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
