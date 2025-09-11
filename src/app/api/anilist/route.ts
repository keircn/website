import { NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

// Slimmed query: only request fields we actually need for the UI.
const USER_ANIME_LIST_QUERY = `
query ($username: String, $type: MediaType) {
  MediaListCollection(userName: $username, type: $type) {
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

// Simple in-memory cache to reduce AniList requests during development.
const cache = new Map<string, { ts: number; value: any }>();
const CACHE_TTL = 60 * 1000; // 60s

async function makeAniListRequest(query: string, variables: any) {
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

function compactMedia(m: any) {
  return {
    id: m.id,
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

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    const cacheKey = `${username.toLowerCase()}::${mediaType}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value);
    }

    const data = await makeAniListRequest(USER_ANIME_LIST_QUERY, { username, type: mediaType });

    if (!data?.MediaListCollection) {
      return NextResponse.json({ error: "user not found or no public lists" }, { status: 404 });
    }

    const rawLists = data.MediaListCollection.lists || [];

    // Group lists by their status (e.g., CURRENT, COMPLETED) but preserve the given "name" too.
    const listsByStatus: Record<string, { name: string; entries: any[] }> = {};
    let totalEntries = 0;

    for (const list of rawLists) {
      const key = list.status || list.name || "OTHER";
      if (!listsByStatus[key]) listsByStatus[key] = { name: list.name || key, entries: [] };

      for (const e of list.entries || []) {
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

    const result = {
      user: data.MediaListCollection.user || null,
      listsByStatus,
      totalEntries,
    };

    cache.set(cacheKey, { ts: now, value: result });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("/api/anilist error:", err?.message || err);
    return NextResponse.json({ error: "internal_server_error", message: err?.message || String(err) }, { status: 500 });
  }
}
