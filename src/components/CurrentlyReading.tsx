"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import ReadingCard from "~/components/ReadingCard";

interface Media {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  format?: string;
  status?: string;
  chapters?: number;
  volumes?: number;
  averageScore?: number;
  genres?: string[];
  coverImage?: {
    large?: string;
    medium?: string;
  };
  description?: string;
}

interface ReadingResponse {
  media: Media;
}

export default function CurrentlyReading() {
  const [data, setData] = useState<ReadingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadingData = useCallback(async () => {
    try {
      setError(null);

      const mediaId = process.env.NEXT_PUBLIC_ANILIST_READING_ID;

      if (!mediaId) {
        throw new Error("ANILIST_READING_ID not configured");
      }

      const response = await fetch(`/api/anilist/reading?id=${mediaId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result: ReadingResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load reading data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReadingData();
    const interval = setInterval(fetchReadingData, 300000);
    return () => clearInterval(interval);
  }, [fetchReadingData]);

  if (loading) {
    return <ReadingCard title="Currently Reading" isLoading />;
  }

  if (error) {
    return <ReadingCard title="Currently Reading" error={error} />;
  }

  if (!data?.media) {
    return (
      <ReadingCard title="Currently Reading" error="No reading data found" />
    );
  }

  const { media } = data;
  const title =
    media.title.english ||
    media.title.romaji ||
    media.title.native ||
    "Unknown Title";

  const capitalizedFormat = media.format
    ? media.format.charAt(0).toUpperCase() + media.format.slice(1).toLowerCase()
    : null;

  return (
    <ReadingCard title="Currently Reading">
      <div className="flex items-center gap-3">
        {media.coverImage?.large ? (
          <Image
            src={media.coverImage.large}
            alt={`${title} cover`}
            width={48}
            height={48}
            className="rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Book icon"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground truncate">
            {title}
          </div>
          {capitalizedFormat && (
            <div className="text-sm text-muted-foreground truncate">
              {capitalizedFormat}
            </div>
          )}
          {media.chapters && (
            <div className="text-xs text-muted-foreground truncate mt-1">
              {media.chapters} chapters
            </div>
          )}
          {media.averageScore && (
            <div className="text-xs text-muted-foreground truncate mt-1">
              {media.averageScore}/100 avg
            </div>
          )}
        </div>
      </div>

      {media.genres && media.genres.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-1">Genres</div>
          <div className="flex flex-wrap gap-1">
            {media.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </ReadingCard>
  );
}
