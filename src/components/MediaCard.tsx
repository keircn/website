"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { CoverImage, MediaTitle } from "../types/anilist";
import { getCoverImageUrl, getPreferredTitle } from "../utils/anilist";

interface ActivityMedia {
  id: number;
  type: string | null;
  siteUrl: string | null;
  title: MediaTitle;
  coverImage: CoverImage | null;
}

interface ActivityItem {
  id: number;
  status: string | null;
  progress: string | null;
  createdAt: number | null;
  media: ActivityMedia;
}

interface MediaCardProps {
  item: ActivityItem;
  index: number;
  hasDragged: boolean;
  mediaType: "ANIME" | "MANGA";
  parentDelay?: number;
}

export default function MediaCard({
  item,
  index,
  hasDragged,
  mediaType,
  parentDelay = 0,
}: MediaCardProps) {
  const title = getPreferredTitle(item.media.title);
  const img = getCoverImageUrl(item.media.coverImage);
  const sub = [item.status, item.progress].filter(Boolean).join(" ");

  const baseUrl =
    mediaType === "ANIME"
      ? `https://anilist.co/anime/${item.media.id}`
      : `https://anilist.co/manga/${item.media.id}`;

  return (
    <motion.div
      key={`${item.media.id}-${item.id}-${index}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: parentDelay + 0.5 + index * 0.08,
        ease: "easeOut",
      }}
    >
      <Link
        href={item.media.siteUrl || baseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-background border border-border rounded overflow-hidden hover:shadow-md transition-[background-color,box-shadow,transform] duration-200 flex flex-col shrink-0 w-32 hover:scale-105"
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
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/code-xml.svg";
            }}
          />
        </div>
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground truncate capitalize">
            {sub || ""}
          </p>
          <sub className="block text-xs text-foreground truncate" title={title}>
            {title}
          </sub>
        </div>
      </Link>
    </motion.div>
  );
}
