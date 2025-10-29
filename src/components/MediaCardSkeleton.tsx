export default function MediaCardSkeleton() {
  return (
    <div className="bg-background border border-border rounded overflow-hidden flex flex-col flex-shrink-0 w-32 animate-pulse">
      <div className="h-48 w-32 bg-muted/20 relative">
        <div className="w-full h-full bg-muted/30" />
      </div>
      <div className="p-2">
        <div className="h-3 bg-muted/20 rounded mb-1 w-3/4" />
        <div className="h-3 bg-muted/30 rounded w-full" />
      </div>
    </div>
  );
}
