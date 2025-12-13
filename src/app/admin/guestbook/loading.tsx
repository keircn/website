export default function GuestbookAdminLoading() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl px-4">
        <div className="mb-6">
          <div className="h-4 w-24 bg-accent/40 rounded animate-pulse mb-2" />
          <div className="h-8 w-56 bg-accent/40 rounded animate-pulse" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-accent/20 border border-border/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="h-5 w-32 bg-accent/40 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-accent/40 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-accent/40 rounded animate-pulse mt-1" />
                  <div className="h-3 w-40 bg-accent/40 rounded animate-pulse mt-3" />
                </div>
                <div className="h-9 w-20 bg-accent/40 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
