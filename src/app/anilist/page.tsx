"use client";

import { useEffect, useState } from "react";
import AnimeCard from "~/components/AnimeCard";

type Media = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; medium?: string };
  episodes?: number;
  format?: string;
  status?: string;
  averageScore?: number;
  genres?: string[];
};

export default function AniListPage() {
  const [username, setUsername] = useState("keiran");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<string, { name: string; entries: any[] }> | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchList() {
    setLoading(true);
    setError(null);
    setGrouped(null);
    setTotal(null);
    try {
      const res = await fetch(`/api/anilist?username=${encodeURIComponent(username)}&type=ANIME`);
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const data = await res.json();
      setGrouped(data.listsByStatus || null);
      setTotal(data.totalEntries || 0);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 pt-12 md:pt-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-muted/10 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold font-mono">keiran — AniList</h1>
              <p className="text-sm text-muted-foreground mt-1">A curated view of keiran's public AniList — lists are grouped to match AniList categories.</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Viewing only keiran</span>
              <button
                onClick={fetchList}
                className="px-3 py-1 bg-foreground text-background rounded hover:opacity-90 transition text-sm"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            {error && (
              <div className="text-sm text-red-400 mb-4">{error}</div>
            )}

            {!loading && !grouped && !error && (
              <div className="text-sm text-muted-foreground">Enter a username and press Fetch to see their public anime lists.</div>
            )}

            {grouped && (
              <div className="mt-4 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="px-2 py-1 bg-foreground text-background rounded text-sm font-medium">{total}</div>
                </div>

                {(() => {
                  // Order: CURRENT (Watching) first, then PLANNING, COMPLETED, others,
                  // then PAUSED and DROPPED at the bottom, and finally any unflowed/other lists.
                  const priority = (s: string) => {
                    if (!s || s === "OTHER") return 50;
                    if (s === "CURRENT") return 0;
                    if (s === "PLANNING") return 10;
                    if (s === "COMPLETED") return 20;
                    if (s === "REPEATING") return 25;
                    if (s === "PAUSED") return 90;
                    if (s === "DROPPED") return 100;
                    return 30;
                  };

                  const statusLabel = (s: string, name: string) => {
                    if (!s || s === "OTHER") return "Unflowed";
                    if (s === "CURRENT") return "Watching";
                    if (s === "PLANNING") return "Plan to Watch";
                    if (s === "COMPLETED") return "Completed";
                    if (s === "PAUSED") return "Paused";
                    if (s === "DROPPED") return "Dropped";
                    return name || s;
                  };

                  return Object.entries(grouped)
                    .sort((a, b) => {
                      const pa = priority(a[0]);
                      const pb = priority(b[0]);
                      if (pa !== pb) return pa - pb;
                      return a[1].name.localeCompare(b[1].name);
                    })
                    .map(([status, group]) => {
                      const isMuted = status === "PAUSED" || status === "DROPPED";
                      const label = statusLabel(status, group.name);
                      return (
                        <section key={status} className="">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`text-lg font-semibold font-mono ${isMuted ? "text-muted-foreground" : "text-foreground"}`}>
                              {label}
                            </h3>
                            <div className="text-sm text-muted-foreground">{group.entries.length} items</div>
                          </div>
                          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${isMuted ? "opacity-70" : ""}`}>
                            {group.entries.map((e: any) => (
                              <AnimeCard key={e.media.id} media={e.media} />
                            ))}
                          </div>
                        </section>
                      );
                    });
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
