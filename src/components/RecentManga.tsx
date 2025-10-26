"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ReadingCard from "~/components/ReadingCard";

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

export default function RecentManga() {
  const [username] = useState("keiran");
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
        `/api/anilist/recent?username=${encodeURIComponent(username)}&perPage=10`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || res.statusText);
      }
      const json: RecentResponse = await res.json();
      setData(json.activities || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load recent manga");
    } finally {
      setLoading(false);
    }
  }, [username]);

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
    <ReadingCard
      title="Recent Manga"
      isLoading={loading}
      error={error || undefined}
    >
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No recent manga found
        </div>
      ) : (
        <section
          ref={scrollRef}
          className="carousel-scroll overflow-x-auto cursor-grab select-none"
          aria-label="Recent manga carousel"
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
            {items.map((item, index) => {
              const title =
                item.media.title.english ||
                item.media.title.romaji ||
                item.media.title.native ||
                "Unknown";
              const img =
                item.media.coverImage?.large ||
                item.media.coverImage?.medium ||
                "/code-xml.svg";
              const sub = [item.status, item.progress]
                .filter(Boolean)
                .join(" ");
              return (
                <motion.div
                  key={`${item.media.id}-${item.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={
                      item.media.siteUrl ||
                      `https://anilist.co/manga/${item.media.id}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background border border-border rounded overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col flex-shrink-0 w-32 hover:scale-105"
                    onClick={(e) => {
                      if (hasDragged) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="h-48 w-32 bg-muted/5 relative overflow-hidden">
                      <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover"
                        draggable={false}
                        unoptimized={img !== "/code-xml.svg"}
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>,
                        ) => {
                          e.currentTarget.src = "/code-xml.svg";
                        }}
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-muted-foreground truncate capitalize">
                        {sub || ""}
                      </p>
                      <sub
                        className="block text-xs text-foreground truncate"
                        title={title}
                      >
                        {title}
                      </sub>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </ReadingCard>
  );
}
