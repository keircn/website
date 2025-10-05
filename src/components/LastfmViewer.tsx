"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Track {
  name: string;
  artist: string;
  album?: string;
  image?: string;
  isNowPlaying: boolean;
  timestamp?: number;
}

interface LastfmData {
  tracks: Track[];
  user: string;
}

export default function LastfmViewer() {
  const [data, setData] = useState<LastfmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLastfmData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/lastfm");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result: LastfmData = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load Last.fm data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastfmData();
    const interval = setInterval(fetchLastfmData, 30000);
    return () => clearInterval(interval);
  }, [fetchLastfmData]);

  const currentTrack = data?.tracks?.find((track) => track.isNowPlaying);
  const recentTracks =
    data?.tracks?.filter((track) => !track.isNowPlaying).slice(0, 3) || [];

  if (loading) {
    return (
      <div className="border border-border bg-muted/10 max-w-sm sm:max-w-md rounded">
        <div className="py-3 border-b border-border flex items-center justify-between mx-4">
          <h3 className="text-lg font-medium text-foreground">Music</h3>
          <svg
            className="w-4 h-4 text-muted-foreground animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-label="Music icon"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded animate-pulse flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border bg-muted/10 max-w-sm sm:max-w-md rounded">
        <div className="py-3 border-b border-border flex items-center justify-between mx-4">
          <h3 className="text-lg font-medium text-foreground">Music</h3>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-label="Music icon"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground">
            Failed to load music data
          </div>
        </div>
      </div>
    );
  }

  const mainTrack =
    currentTrack || (recentTracks.length > 0 ? recentTracks[0] : null);

  if (!mainTrack) {
    return (
      <div className="border border-border bg-muted/10 max-w-sm sm:max-w-md rounded">
        <div className="py-3 border-b border-border flex items-center justify-between mx-4">
          <h3 className="text-lg font-medium text-foreground">Music</h3>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-label="Music icon"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground">
            No recent tracks found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-muted/10 max-w-sm sm:max-w-md rounded">
      <div className="py-3 border-b border-border flex items-center justify-between mx-4">
        <h3 className="text-lg font-medium text-foreground">
          {mainTrack.isNowPlaying ? "Now Playing" : "Last Played"}
        </h3>
        <div className="flex items-center gap-1.5">
          {mainTrack.isNowPlaying && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-label="Music icon"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {mainTrack.image ? (
            <Image
              src={mainTrack.image}
              alt={`${mainTrack.name} cover`}
              width={48}
              height={48}
              className="rounded object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="currentColor"
                viewBox="0 0 20 20"
                role="img"
                aria-label="Music note icon"
              >
                <path
                  fillRule="evenodd"
                  d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground truncate">
              {mainTrack.name}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {mainTrack.artist}
            </div>
            {mainTrack.album && (
              <div className="text-xs text-muted-foreground truncate mt-1">
                {mainTrack.album}
              </div>
            )}
          </div>
        </div>

        {!mainTrack.isNowPlaying && recentTracks.length > 1 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">
              Recently played
            </div>
            <div className="space-y-1">
              {recentTracks.slice(1, 3).map((track, index) => (
                <div
                  key={`${track.name}-${track.artist}-${index}`}
                  className="text-xs text-muted-foreground/80 truncate"
                >
                  {track.name} • {track.artist}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
