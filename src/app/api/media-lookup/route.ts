import { type NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";
const VNDB_API = "https://api.vndb.org/kana";

const ANILIST_MEDIA_QUERY = `
query ($id: Int, $type: MediaType) {
  Media(id: $id, type: $type) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      medium
    }
    format
    status
    genres
    averageScore
    description(asHtml: false)
    siteUrl
  }
}`;

interface AniListMediaResponse {
  data?: {
    Media?: {
      id: number;
      title: {
        romaji?: string;
        english?: string;
        native?: string;
      };
      coverImage?: {
        large?: string;
        medium?: string;
      };
      format?: string;
      status?: string;
      genres?: string[];
      averageScore?: number;
      description?: string;
      siteUrl?: string;
    };
  };
  errors?: Array<{ message: string }>;
}

interface VNDBResponse {
  results?: Array<{
    id: string;
    title: string;
    alttitle?: string;
    image?: {
      url?: string;
    };
    description?: string;
    released?: string;
    rating?: number;
  }>;
}

export interface MediaLookupResult {
  success: boolean;
  data?: {
    externalId: string;
    title: string;
    coverImage: string | null;
    metadata: {
      format?: string;
      status?: string;
      genres?: string[];
      averageScore?: number;
      description?: string;
      siteUrl?: string;
      released?: string;
    };
  };
  error?: string;
}

async function fetchAniListMedia(
  id: number,
  type: "ANIME" | "MANGA",
): Promise<MediaLookupResult> {
  try {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_MEDIA_QUERY,
        variables: { id, type },
      }),
    });

    if (!res.ok) {
      return { success: false, error: `AniList API error: ${res.status}` };
    }

    const json: AniListMediaResponse = await res.json();

    if (json.errors?.length) {
      return { success: false, error: json.errors[0].message };
    }

    const media = json.data?.Media;
    if (!media) {
      return { success: false, error: "Media not found" };
    }

    return {
      success: true,
      data: {
        externalId: String(media.id),
        title:
          media.title.english || media.title.romaji || media.title.native || "",
        coverImage: media.coverImage?.large || media.coverImage?.medium || null,
        metadata: {
          format: media.format,
          status: media.status,
          genres: media.genres,
          averageScore: media.averageScore,
          description: media.description,
          siteUrl: media.siteUrl,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function fetchVNDBMedia(id: string): Promise<MediaLookupResult> {
  try {
    const vndbId = id.startsWith("v") ? id : `v${id}`;

    const res = await fetch(`${VNDB_API}/vn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: ["id", "=", vndbId],
        fields: "id, title, alttitle, image.url, description, released, rating",
      }),
    });

    if (!res.ok) {
      return { success: false, error: `VNDB API error: ${res.status}` };
    }

    const json: VNDBResponse = await res.json();

    if (!json.results?.length) {
      return { success: false, error: "Visual novel not found" };
    }

    const vn = json.results[0];

    return {
      success: true,
      data: {
        externalId: vn.id,
        title: vn.title || vn.alttitle || "",
        coverImage: vn.image?.url || null,
        metadata: {
          description: vn.description,
          released: vn.released,
          averageScore: vn.rating ? Math.round(vn.rating) : undefined,
          siteUrl: `https://vndb.org/${vn.id}`,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type")?.toLowerCase();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID is required" },
      { status: 400 },
    );
  }

  if (!type || !["anime", "manga", "novel", "vn"].includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: "Type must be one of: anime, manga, novel, vn",
      },
      { status: 400 },
    );
  }

  let result: MediaLookupResult;

  if (type === "vn") {
    result = await fetchVNDBMedia(id);
  } else {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "Invalid AniList ID" },
        { status: 400 },
      );
    }

    const anilistType = type === "anime" ? "ANIME" : "MANGA";
    result = await fetchAniListMedia(numericId, anilistType);
  }

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
