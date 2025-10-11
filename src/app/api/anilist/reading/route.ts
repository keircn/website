import { type NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

interface AniListVariables {
  id?: number;
  username?: string;
}

interface UserData {
  User?: {
    id: number;
    name: string;
  };
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

interface MediaListData {
  MediaList?: {
    id: number;
    status?: string;
    score?: number;
    progress?: number;
    progressVolumes?: number;
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

const USER_QUERY = `
query ($username: String) {
  User(name: $username) {
    id
    name
  }
}`;

const MEDIA_LIST_QUERY = `
query ($mediaId: Int, $userId: Int) {
  MediaList(mediaId: $mediaId, userId: $userId) {
    id
    status
    score
    progress
    progressVolumes
    updatedAt
    media {
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
  }
}`;

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;

async function makeAniListRequest(
  query: string,
  variables: AniListVariables | { mediaId: number; userId?: number },
): Promise<MediaData | MediaListData | UserData> {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");
    const username = searchParams.get("username");

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

    const cacheKey = `reading::${id}::${username || "none"}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value);
    }

    let result: {
      media: unknown;
      userProgress: unknown;
    };

    if (username) {
      const userData = (await makeAniListRequest(USER_QUERY, {
        username,
      })) as UserData;

      if (!userData?.User) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userId = userData.User.id;

      const data = (await makeAniListRequest(MEDIA_LIST_QUERY, {
        mediaId: id,
        userId,
      })) as MediaListData;

      if (!data?.MediaList?.media) {
        return NextResponse.json(
          { error: "Media list entry not found" },
          { status: 404 },
        );
      }

      result = {
        media: data.MediaList.media,
        userProgress: {
          status: data.MediaList.status,
          score: data.MediaList.score,
          progress: data.MediaList.progress,
          progressVolumes: data.MediaList.progressVolumes,
          updatedAt: data.MediaList.updatedAt,
        },
      };
    } else {
      const data = (await makeAniListRequest(MEDIA_QUERY, { id })) as MediaData;

      if (!data?.Media) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }

      result = {
        media: data.Media,
        userProgress: null,
      };
    }

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
