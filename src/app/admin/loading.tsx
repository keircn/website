export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 bg-accent/40 rounded animate-pulse" />
          <div className="h-10 w-24 bg-accent/40 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-accent/20 border border-border/40">
            <div className="h-6 w-48 bg-accent/40 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-accent/40 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-accent/40 rounded animate-pulse mt-2" />
          </div>
          <div className="p-6 rounded-xl bg-accent/20 border border-border/40">
            <div className="h-6 w-48 bg-accent/40 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-accent/40 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-accent/40 rounded animate-pulse mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
