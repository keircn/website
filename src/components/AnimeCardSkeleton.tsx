export default function AnimeCardSkeleton() {
  return (
    <article className="bg-background border border-border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[2/3] w-full bg-muted/20 relative">
        <div className="w-full h-full bg-muted/30" />
        <div className="absolute left-2 top-2 w-12 h-5 bg-muted/40 rounded" />
      </div>
      <div className="p-3 flex flex-col h-36">
        <div className="h-10 mb-1">
          <div className="h-4 bg-muted/30 rounded mb-1" />
          <div className="h-4 bg-muted/20 rounded w-3/4" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 bg-muted/20 rounded w-12" />
          <div className="h-3 bg-muted/20 rounded w-16" />
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0">
          <div className="h-8 mb-2 flex items-start">
            <div className="flex gap-1">
              <div className="h-5 bg-muted/20 rounded-full w-12" />
              <div className="h-5 bg-muted/20 rounded-full w-16" />
              <div className="h-5 bg-muted/20 rounded-full w-10" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="h-3 bg-muted/30 rounded w-8" />
            <div className="h-3 bg-muted/20 rounded w-10" />
          </div>
        </div>
      </div>
    </article>
  );
}
