"use client";

export default function AnimeCard({ media }: { media: any }) {
  const title = media.title?.english || media.title?.romaji || media.title?.native || "Unknown";
  const img = media.coverImage?.large || media.coverImage?.medium || "/code-xml.svg";

  return (
    <article className="bg-background border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
      <div className="aspect-[2/3] w-full bg-muted/5 relative">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e: any) => {
            e.currentTarget.src = "/code-xml.svg";
          }}
        />
        <div className="absolute left-2 top-2 px-2 py-1 bg-foreground/90 text-background text-xs rounded">{media.format || "—"}</div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium leading-snug">{title}</h3>
        <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
          <span>{media.episodes ? `${media.episodes} ep` : "—"}</span>
          <span className="italic">{media.status || "—"}</span>
        </div>

        {media.genres && media.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {media.genres.slice(0, 5).map((g: string) => (
              <span key={g} className="text-[10px] px-2 py-1 bg-muted/20 text-muted-foreground rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span className="font-medium text-foreground">{media.averageScore ? `${media.averageScore}%` : "—"}</span>
          <span className="text-[11px] text-muted-foreground">ID {media.id}</span>
        </div>
      </div>
    </article>
  );
}
