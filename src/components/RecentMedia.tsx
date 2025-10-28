"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReadingCard from "~/components/ReadingCard";
import MediaCard from "~/components/MediaCard";

interface ActivityMediaTitle {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
}

interface ActivityMediaCover {
  large?: string | null;
  medium?: string | null;
}

interface ActivityMedia {
  id: number;
  type: string | null;
  siteUrl: string | null;
  title: ActivityMediaTitle;
  coverImage: ActivityMediaCover | null;
}

interface ActivityItem {
  id: number;
  status: string | null;
  progress: string | null;
  createdAt: number | null;
  media: ActivityMedia;
}

interface RecentResponse {
  activities: ActivityItem[];
}

interface RecentMediaProps {
  mediaType: "ANIME" | "MANGA";
  title: string;
  username?: string;
  parentDelay?: number;
}

export default function RecentMedia({
  mediaType,
  title,
  username = "keiran",
  parentDelay = 0,
}: RecentMediaProps) {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const DRAG_THRESHOLD = 3; // px

  const fetchRecent = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(
        `/api/anilist/recent?username=${encodeURIComponent(username)}&perPage=10&type=${mediaType}`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || res.statusText);
      }
      const json: RecentResponse = await res.json();
      setData(json.activities || []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : `Failed to load recent ${mediaType.toLowerCase()}`,
      );
    } finally {
      setLoading(false);
    }
  }, [username, mediaType]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || !scrollRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      if (!(e.buttons & 1)) {
        setIsDragging(false);
        scrollRef.current.style.cursor = "grab";
        return;
      }
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX * 1.5;

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        setHasDragged(true);
      }

      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
    setTimeout(() => setHasDragged(false), 50);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (scrollRef.current && !isDragging) {
      scrollRef.current.style.cursor = "grab";
    }
  }, [isDragging]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      if (!(e.buttons & 1)) {
        setIsDragging(false);
        scrollRef.current.style.cursor = "grab";
        return;
      }
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX;

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        setHasDragged(true);
      }

      scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (scrollRef.current) {
          scrollRef.current.style.cursor = "grab";
        }
        setTimeout(() => setHasDragged(false), 50);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !scrollRef.current) return;
      const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
      const walk = x - startX;

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        setHasDragged(true);
      }

      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 50);
  }, []);

  useEffect(() => {
    fetchRecent();
    const i = setInterval(fetchRecent, 300000);
    return () => clearInterval(i);
  }, [fetchRecent]);

  const items = data.slice(0, 10);

  return (
    <ReadingCard title={title} isLoading={loading} error={error || undefined}>
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No recent {mediaType.toLowerCase()} found
        </div>
      ) : (
        <section
          ref={scrollRef}
          className="carousel-scroll overflow-x-auto cursor-grab select-none"
          aria-label={`Recent ${mediaType.toLowerCase()} carousel`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              if (scrollRef.current) {
                scrollRef.current.scrollLeft -= 150;
              }
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              if (scrollRef.current) {
                scrollRef.current.scrollLeft += 150;
              }
            }
          }}
          style={{ userSelect: "none" }}
        >
          <div className="flex gap-3 pb-2 scroll-smooth">
            {items.map((item, index) => (
              <MediaCard
                key={`${item.media.id}-${item.id}-${index}`}
                item={item}
                index={index}
                hasDragged={hasDragged}
                mediaType={mediaType}
                parentDelay={parentDelay}
              />
            ))}
          </div>
        </section>
      )}
    </ReadingCard>
  );
}
