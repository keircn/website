"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

interface AnimeEntry {
  id: number;
  media: {
    id: number;
    title: {
      romaji: string;
      english: string | null;
    };
    coverImage: {
      large: string;
    };
    episodes: number | null;
    status: string;
    genres: string[];
    meanScore: number | null;
    startDate: {
      year: number | null;
    };
  };
  score: number;
  completedAt: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
}

const ANILIST_QUERY = `
  query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME, status: COMPLETED, sort: SCORE_DESC) {
      lists {
        entries {
          id
          score
          completedAt {
            year
            month
            day
          }
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            episodes
            status
            genres
            meanScore
            startDate {
              year
            }
          }
        }
      }
    }
  }
`;

async function fetchTopRatedAnime(): Promise<AnimeEntry[]> {
  try {
    const response = await fetch("/api/anilist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: {
          username: "keirandev",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const entries = data.data?.MediaListCollection?.lists?.[0]?.entries || [];
    return entries.filter((entry: AnimeEntry) => entry.score > 0).slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch anime data:", error);
    return [];
  }
}

function AnimeEntryItem({ entry, rank }: { entry: AnimeEntry; rank: number }) {
  const displayTitle = entry.media.title.english || entry.media.title.romaji;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-primary">#{rank}</span>
      </div>
      <div className="relative flex-shrink-0">
        <Image
          src={entry.media.coverImage.large}
          alt={displayTitle}
          width={50}
          height={50}
          className="rounded object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-card-foreground truncate">
          {displayTitle}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {entry.media.episodes} episodes • {entry.media.startDate?.year || 'N/A'}
          </p>
          <p className="text-sm font-bold text-primary">
            {entry.score}/100
          </p>
        </div>
        {entry.media.genres.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            {entry.media.genres.slice(0, 2).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-18 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnimeCard() {
  const [topAnime, setTopAnime] = useState<AnimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedAnime().then((data) => {
      setTopAnime(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl"
    >
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">My Top 5 Anime</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : topAnime.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No rated anime found
            </p>
          ) : (
            <div className="space-y-4">
              {topAnime.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <AnimeEntryItem entry={entry} rank={index + 1} />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
