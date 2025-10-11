import { type NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

interface AniListVariables {
  id?: number;
}

interface MediaData {
  Media?: {
    id: number;
    title?: {
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
  };
}

interface CacheEntry {
  ts: number;
  value: unknown;
}

const MEDIA_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title { romaji english native }
    format
    status
    chapters
    volumes
    averageScore
    genres
    coverImage { large medium }
    description
  }
}`;

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;

async function makeAniListRequest(
  query: string,
  variables: AniListVariables,
): Promise<MediaData> {
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 },
      );
    }

    const id = parseInt(mediaId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid media ID" }, { status: 400 });
    }

    const cacheKey = `reading::${id}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value);
    }

    const data = (await makeAniListRequest(MEDIA_QUERY, { id })) as MediaData;

    if (!data?.Media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const result = {
      media: data.Media,
    };

    cache.set(cacheKey, { ts: now, value: result });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/anilist/reading error:", message);
    return NextResponse.json(
      { error: "internal_server_error", message },
      { status: 500 },
    );
  }
}
