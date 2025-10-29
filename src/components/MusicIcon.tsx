import { HiOutlineMusicNote } from "react-icons/hi";

interface MusicIconProps {
  className?: string;
  animate?: boolean;
}

export default function MusicIcon({
  className = "w-4 h-4 text-muted-foreground",
  animate = false,
}: MusicIconProps) {
  return (
    <HiOutlineMusicNote
      className={`${className} ${animate ? "animate-pulse" : ""}`}
      aria-label="Music icon"
    />
  );
}
