import { type NextRequest, NextResponse } from "next/server";
import { CacheService } from "~/services/cache";
import type { Media as SharedMedia } from "~/types/anilist";

const ANILIST_API = "https://graphql.anilist.co";

interface AniListVariables {
  username?: string;
  type?: string;
  perChunk?: number;
}

interface AniListData {
  MediaListCollection?: {
    user?: unknown;
    lists?: Array<{
      name?: string;
      status?: string;
      entries?: Array<{
        id: number;
        status?: string;
        score?: number;
        progress?: number;
        updatedAt?: number;
        media?: {
          id: number;
          title?: {
            romaji?: string;
            english?: string;
            native?: string;
          };
          format?: string;
          status?: string;
          episodes?: number;
          averageScore?: number;
          genres?: string[];
          coverImage?: {
            large?: string;
            medium?: string;
          };
        };
      }>;
    }>;
  };
}

const USER_ANIME_LIST_QUERY = `
query ($username: String, $type: MediaType, $perChunk: Int) {
  MediaListCollection(userName: $username, type: $type, perChunk: $perChunk) {
    user {
      id
      name
      avatar { large }
    }
    lists {
      name
      status
      entries {
        id
        status
        score
        progress
        updatedAt
        media {
          id
          title { romaji english native }
          format
          status
          episodes
          averageScore
          genres
          coverImage { large medium }
        }
      }
    }
  }
}`;

const cacheService = CacheService.getInstance();

async function makeAniListRequest(
  query: string,
  variables: AniListVariables,
): Promise<AniListData> {
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AniList responded ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data.data;
}

interface ListEntry {
  id: number;
  status?: string;
  score?: number;
  progress?: number;
  updatedAt?: number;
  media: SharedMedia;
}

interface AniListMedia {
  id?: number;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  format?: string;
  status?: string;
  episodes?: number;
  averageScore?: number;
  genres?: string[];
  coverImage?: {
    large?: string;
    medium?: string;
  };
}

function compactMedia(m: AniListMedia | null | undefined): SharedMedia {
  if (!m) {
    return {
      id: 0,
      title: { romaji: undefined, english: undefined, native: undefined },
      format: undefined,
      status: undefined,
      episodes: undefined,
      averageScore: undefined,
      genres: [],
      coverImage: null,
    };
  }

  return {
    id: m.id || 0,
    title: m.title || {
      romaji: undefined,
      english: undefined,
      native: undefined,
    },
    format: m.format,
    status: m.status,
    episodes: m.episodes,
    averageScore: m.averageScore,
    genres: m.genres || [],
    coverImage: m.coverImage || null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = (searchParams.get("username") || "").trim();
    const mediaType = searchParams.get("type") || "ANIME";
    const perChunk = parseInt(searchParams.get("perChunk") || "500", 10);

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 },
      );
    }

    const cacheKey = `${username.toLowerCase()}::${mediaType}::${perChunk}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const data = await makeAniListRequest(USER_ANIME_LIST_QUERY, {
      username,
      type: mediaType,
      perChunk,
    });

    if (!data?.MediaListCollection) {
      return NextResponse.json(
        { error: "user not found or no public lists" },
        { status: 404 },
      );
    }

    const rawLists = data.MediaListCollection.lists || [];

    const listsByStatus: Record<
      string,
      { name: string; entries: ListEntry[] }
    > = {};
    let totalEntries = 0;

    for (const list of rawLists) {
      const key = list.status || list.name || "OTHER";
      if (!listsByStatus[key])
        listsByStatus[key] = { name: list.name || key, entries: [] };

      for (const e of list.entries || []) {
        if (e.media?.status === "NOT_YET_RELEASED") {
          continue;
        }

        listsByStatus[key].entries.push({
          id: e.id,
          status: e.status,
          score: e.score,
          progress: e.progress,
          updatedAt: e.updatedAt,
          media: compactMedia(e.media || {}),
        });
        totalEntries += 1;
      }
    }

    const episodeCounts: Record<string, number> = {};
    const statusesToCount = ["CURRENT", "PAUSED", "DROPPED"];

    for (const status of statusesToCount) {
      const list = listsByStatus[status];
      if (list) {
        episodeCounts[status] = list.entries.reduce((total, entry) => {
          return total + (entry.progress || 0);
        }, 0);
      }
    }

    const result = {
      user: data.MediaListCollection.user || null,
      listsByStatus,
      totalEntries,
      perChunk,
      episodeCounts,
    };

    await cacheService.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/anilist error:", message);
    return NextResponse.json(
      { error: "internal_server_error", message },
      { status: 500 },
    );
  }
}
