import { type NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

interface AniListVariables {
  username?: string;
  type?: string;
  perChunk?: number;
  offset?: number;
  limit?: number;
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

interface CompactMedia {
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
  genres: string[];
  coverImage: {
    large?: string;
    medium?: string;
  } | null;
}

interface CacheEntry {
  ts: number;
  value: unknown;
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

const cache = new Map<string, CacheEntry>();
const fullDataCache = new Map<string, CacheEntry>(); // Separate cache for full data
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes - increased for better performance

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
  media: CompactMedia;
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

function compactMedia(m: AniListMedia | null | undefined): CompactMedia {
  if (!m) {
    return {
      id: 0,
      genres: [],
      coverImage: null,
    };
  }

  return {
    id: m.id || 0,
    title: m.title,
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
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "0", 10); // 0 means no limit

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 },
      );
    }

    // Use separate cache keys for full data vs paginated
    const baseCacheKey = `${username.toLowerCase()}::${mediaType}::${perChunk}`;
    const fullDataCacheKey = `${baseCacheKey}::full`;
    const cacheKey = limit > 0 ? `${baseCacheKey}::${offset}::${limit}` : baseCacheKey;
    const now = Date.now();

    // For paginated requests, try to serve from full data cache first
    if (limit > 0) {
      const fullCached = fullDataCache.get(fullDataCacheKey);
      if (fullCached && now - fullCached.ts < CACHE_TTL) {
        const fullData = fullCached.value as {
          listsByStatus: Record<string, { name: string; entries: ListEntry[] }>;
          totalEntries: number;
        };

        // Slice the data for pagination
        const paginatedListsByStatus: Record<string, { name: string; entries: ListEntry[] }> = {};
        Object.keys(fullData.listsByStatus).forEach((status) => {
          const entries = fullData.listsByStatus[status].entries;
          paginatedListsByStatus[status] = {
            name: fullData.listsByStatus[status].name,
            entries: entries.slice(offset, offset + limit),
          };
        });

        const result = {
          listsByStatus: paginatedListsByStatus,
          totalEntries: fullData.totalEntries,
          perChunk,
          pagination: {
            offset,
            limit,
            totalPerStatus: Object.fromEntries(
              Object.entries(fullData.listsByStatus).map(([k, v]) => [
                k,
                v.entries.length,
              ]),
            ),
          },
        };

        cache.set(cacheKey, { ts: now, value: result });
        return NextResponse.json(result, {
          headers: {
            "Cache-Control": "public, max-age=600, s-maxage=600", // 10 minutes
            ETag: `"${cacheKey}-${fullCached.ts}"`,
          },
        });
      }
    }

    // Check regular cache for non-paginated or if full data cache miss
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value, {
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=600", // 10 minutes
          ETag: `"${cacheKey}-${cached.ts}"`,
        },
      });
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

    // Store full data in separate cache for future pagination requests
    const fullData = {
      listsByStatus,
      totalEntries,
    };
    fullDataCache.set(fullDataCacheKey, { ts: now, value: fullData });

    // Apply pagination if requested
    if (limit > 0) {
      const paginatedListsByStatus: Record<
        string,
        { name: string; entries: ListEntry[] }
      > = {};
      Object.keys(listsByStatus).forEach((status) => {
        const entries = listsByStatus[status].entries;
        paginatedListsByStatus[status] = {
          name: listsByStatus[status].name,
          entries: entries.slice(offset, offset + limit),
        };
      });
      const result = {
        user: data.MediaListCollection.user || null,
        listsByStatus: paginatedListsByStatus,
        totalEntries,
        perChunk,
        pagination: {
          offset,
          limit,
          totalPerStatus: Object.fromEntries(
            Object.entries(listsByStatus).map(([k, v]) => [
              k,
              v.entries.length,
            ]),
          ),
        },
      };
      cache.set(cacheKey, { ts: now, value: result });
      return NextResponse.json(result, {
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=600", // 10 minutes
          ETag: `"${cacheKey}-${now}"`,
        },
      });
    }

    const result = {
      user: data.MediaListCollection.user || null,
      listsByStatus,
      totalEntries,
      perChunk,
      pagination:
        limit > 0
          ? { offset, limit, hasMore: totalEntries > offset + limit }
          : null,
    };

    cache.set(cacheKey, { ts: now, value: result });
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=600, s-maxage=600", // 10 minutes
        ETag: `"${cacheKey}-${now}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/anilist error:", message);
    return NextResponse.json(
      { error: "internal_server_error", message },
      { status: 500 },
    );
  }
}
