interface MusicIconProps {
  className?: string;
  animate?: boolean;
}

export default function MusicIcon({
  className = "w-4 h-4 text-muted-foreground",
  animate = false,
}: MusicIconProps) {
  return (
    <svg
      className={`${className} ${animate ? "animate-pulse" : ""}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      role="img"
      aria-label="Music icon"
    >
      <path
        fillRule="evenodd"
        d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
        clipRule="evenodd"
      />
    </svg>
  );
}
