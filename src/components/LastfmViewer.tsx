"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MusicCard from "~/components/MusicCard";
import MusicIcon from "~/components/MusicIcon";

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
    return <MusicCard title="Music" isLoading />;
  }

  if (error) {
    return <MusicCard title="Music" error={error} />;
  }

  const mainTrack =
    currentTrack || (recentTracks.length > 0 ? recentTracks[0] : null);

  if (!mainTrack) {
    return <MusicCard title="Music" error="No recent tracks found" />;
  }

  return (
    <MusicCard title={mainTrack.isNowPlaying ? "Now Playing" : "Last Played"}>
      {mainTrack.isNowPlaying && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
      <div className="flex items-center gap-3">
        {mainTrack.image ? (
          <Image
            src={mainTrack.image}
            alt={`${mainTrack.name} cover`}
            width={48}
            height={48}
            className="rounded object-cover flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0"
          style={{ display: mainTrack.image ? "none" : "flex" }}
        >
          <MusicIcon className="w-5 h-5 text-muted-foreground" />
        </div>
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
    </MusicCard>
  );
}
