import { type NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

interface AniListVariables {
  userName?: string;
  userId?: number;
  perPage?: number;
}

interface ListActivity {
  __typename: "ListActivity";
  id?: number;
  status?: string | null;
  progress?: string | null;
  createdAt?: number | null;
  media?: {
    id?: number | null;
    type?: "ANIME" | "MANGA" | null;
    siteUrl?: string | null;
    title?: {
      romaji?: string | null;
      english?: string | null;
      native?: string | null;
    } | null;
    coverImage?: {
      extraLarge?: string | null;
      large?: string | null;
      medium?: string | null;
    } | null;
  } | null;
}

interface AniListData {
  User?: {
    id: number;
  };
  Page?: {
    activities?: Array<ListActivity | Record<string, unknown>>;
  };
}

interface CacheEntry<T> {
  ts: number;
  value: T;
}

const USER_ID_QUERY = `
query ($userName: String) {
  User(name: $userName) {
    id
  }
}`;

const RECENT_ACTIVITIES_QUERY = `
query ($userId: Int, $perPage: Int) {
  Page(perPage: $perPage) {
    activities(userId: $userId, type: MEDIA_LIST, sort: ID_DESC) {
      ... on ListActivity {
        media {
          siteUrl
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
          }
          type
          id
        }
        status
        progress
        createdAt
      }
    }
  }
}`;

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 60 * 1000;

async function makeAniListRequest(query: string, variables: AniListVariables) {
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
  return data.data as AniListData;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userName = (searchParams.get("username") || "").trim();
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);
    const mediaType = (searchParams.get("type") || "MANGA").toUpperCase();

    if (!userName) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 },
      );
    }

    const cacheKey = `recent::${userName.toLowerCase()}::${perPage}::${mediaType}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value);
    }

    const userData = (await makeAniListRequest(USER_ID_QUERY, {
      userName,
    })) as { User?: { id: number } };
    const userId = userData.User?.id;
    if (!userId) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    const fetchSize = Math.min(perPage * 4, 50);
    const data = await makeAniListRequest(RECENT_ACTIVITIES_QUERY, {
      userId,
      perPage: fetchSize,
    });

    const rawActs = (data.Page?.activities || []).filter(
      (a): a is ListActivity => a.media != null,
    );

    const activities = [] as Array<{
      id: number;
      status: string | null;
      progress: string | null;
      createdAt: number | null;
      media: {
        id: number;
        type: string | null;
        siteUrl: string | null;
        title: {
          romaji?: string | null;
          english?: string | null;
          native?: string | null;
        };
        coverImage: { large?: string | null; medium?: string | null } | null;
      };
    }>;

    for (const act of rawActs) {
      const media = act.media;
      if (!media) continue;
      const id = media.id ?? undefined;
      const type = media.type ?? null;
      if (!id || type !== mediaType) continue;

      activities.push({
        id: id,
        status: act.status ?? null,
        progress: act.progress ?? null,
        createdAt: act.createdAt ?? null,
        media: {
          id,
          type,
          siteUrl: media.siteUrl ?? null,
          title: media.title || {},
          coverImage: {
            large:
              media.coverImage?.extraLarge || media.coverImage?.large || null,
            medium: media.coverImage?.medium || null,
          },
        },
      });
      if (activities.length >= perPage) break;
    }

    const result = { activities };
    cache.set(cacheKey, { ts: now, value: result });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/anilist/recent error:", message);
    return NextResponse.json(
      { error: "internal_server_error", message },
      { status: 500 },
    );
  }
}
