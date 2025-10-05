import { type NextRequest, NextResponse } from "next/server";

const LASTFM_API = "https://ws.audioscrobbler.com/2.0/";

interface LastfmTrack {
  name: string;
  artist: {
    "#text": string;
  };
  album?: {
    "#text": string;
  };
  image?: Array<{
    "#text": string;
    size: string;
  }>;
  date?: {
    uts: string;
    "#text": string;
  };
  "@attr"?: {
    nowplaying?: string;
  };
}

interface LastfmResponse {
  recenttracks?: {
    track?: LastfmTrack[];
    "@attr"?: {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
  error?: number;
  message?: string;
}

interface CacheEntry {
  ts: number;
  value: unknown;
}

interface ProcessedTrack {
  name: string;
  artist: string;
  album?: string;
  image?: string;
  isNowPlaying: boolean;
  timestamp?: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const username = process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!username || !apiKey) {
      return NextResponse.json(
        { error: "Last.fm credentials not configured" },
        { status: 500 },
      );
    }

    const cacheKey = `lastfm:${username}:${limit}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.value);
    }

    const url = new URL(LASTFM_API);
    url.searchParams.set("method", "user.getrecenttracks");
    url.searchParams.set("user", username);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Last.fm API responded with ${response.status}`);
    }

    const data: LastfmResponse = await response.json();

    if (data.error) {
      throw new Error(`Last.fm API error: ${data.message}`);
    }

    const tracks = data.recenttracks?.track || [];
    const processedTracks: ProcessedTrack[] = tracks.map((track) => {
      const largeImage = track.image?.find((img) => img.size === "large")?.[
        "#text"
      ];
      return {
        name: track.name,
        artist: track.artist["#text"],
        album: track.album?.["#text"],
        image: largeImage,
        isNowPlaying: !!track["@attr"]?.nowplaying,
        timestamp: track.date ? parseInt(track.date.uts) * 1000 : undefined,
      };
    });

    const result = {
      tracks: processedTracks,
      user: data.recenttracks?.["@attr"]?.user || username,
    };

    cache.set(cacheKey, { ts: now, value: result });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/lastfm error:", message);
    return NextResponse.json(
      { error: "internal_server_error", message },
      { status: 500 },
    );
  }
}
