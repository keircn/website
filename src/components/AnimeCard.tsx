"use client";

import Image from "next/image";

interface MediaTitle {
  english?: string;
  romaji?: string;
  native?: string;
}

interface CoverImage {
  large?: string;
  medium?: string;
}

interface Media {
  id: number;
  title: MediaTitle;
  format?: string;
  status?: string;
  episodes?: number;
  averageScore?: number;
  genres: string[];
  coverImage: CoverImage | null;
}

export default function AnimeCard({ media }: { media: Media }) {
  const title =
    media.title?.english ||
    media.title?.romaji ||
    media.title?.native ||
    "Unknown";
  const img =
    media.coverImage?.large || media.coverImage?.medium || "/code-xml.svg";

  console.log(
    `AnimeCard for ${title}: coverImage=${JSON.stringify(media.coverImage)}, using=${img}`,
  );

  return (
    <article className="bg-background border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
      <div className="aspect-[2/3] w-full bg-muted/5 relative">
        <Image
          src={img}
          alt={title}
          width={300}
          height={450}
          className="w-full h-full object-cover"
          unoptimized={img !== "/code-xml.svg"}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            console.log(`Image failed to load: ${img}`);
            e.currentTarget.src = "/code-xml.svg";
          }}
        />
        <div className="absolute left-2 top-2 px-2 py-1 bg-foreground/90 text-background text-xs rounded">
          {media.format || "—"}
        </div>
      </div>
      <div className="p-3 flex flex-col h-36">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-1 h-10 flex items-start">
          <span>{title}</span>
        </h3>
        <div className="text-xs text-muted-foreground flex items-center justify-between mb-2">
          <span>{media.episodes ? `${media.episodes} ep` : "—"}</span>
          <span className="italic">{media.status || "—"}</span>
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0">
          <div className="h-8 mb-2 flex items-start">
            <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden">
              {media.genres && media.genres.length > 0 ? (
                media.genres.slice(0, 3).map((g: string) => (
                  <span
                    key={g}
                    className="text-[10px] px-2 py-0.5 bg-muted/20 text-muted-foreground rounded-full whitespace-nowrap leading-tight"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-[10px] px-2 py-0.5 bg-muted/20 text-muted-foreground rounded-full leading-tight">
                  No genres
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span className="font-medium text-foreground">
              {media.averageScore ? `${media.averageScore}%` : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              ID {media.id}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
