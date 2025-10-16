import MusicIcon from "~/components/MusicIcon";

interface MusicCardProps {
  title: string;
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
}

export default function MusicCard({
  title,
  isLoading,
  error,
  children,
}: MusicCardProps) {
  return (
  <div className="border border-border bg-muted/10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded">
      <div className="py-3 border-b border-border flex items-center justify-between mx-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <MusicIcon animate={isLoading} />
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded animate-pulse flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground">
            Failed to load music data
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
