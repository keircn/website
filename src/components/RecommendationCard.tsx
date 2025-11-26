"use client";

import Image from "next/image";
import Link from "next/link";
import type { Recommendation } from "~/db/schema";

export type RecommendationCardProps = {
  recommendation: Recommendation;
};

function getExternalUrl(type: string, externalId: string): string {
  switch (type) {
    case "anime":
      return `https://anilist.co/anime/${externalId}`;
    case "manga":
      return `https://anilist.co/manga/${externalId}`;
    case "novel":
      return `https://anilist.co/manga/${externalId}`;
    case "vn":
      return `https://vndb.org/${externalId}`;
    default:
      return "#";
  }
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const metadata = recommendation.metadata as Record<string, unknown> | null;

  const score = metadata?.score;
  const format = metadata?.format;
  const status = metadata?.status;

  const externalUrl = getExternalUrl(
    recommendation.type,
    recommendation.externalId,
  );

  return (
    <Link
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-xl bg-accent/20 border border-border/40 hover:border-fuchsia-300/40 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-300/10 block"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="shrink-0">
          <div className="relative w-full sm:w-32 h-48 sm:h-44 rounded-lg overflow-hidden bg-accent/40">
            {recommendation.coverImage ? (
              <Image
                src={recommendation.coverImage}
                alt={recommendation.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-fuchsia-300 transition-colors">
            {recommendation.title}
          </h3>

          {metadata && (
            <div className="flex flex-wrap gap-2 mb-2">
              {typeof score === "number" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-300/10 text-fuchsia-300 border border-fuchsia-300/20">
                  {score}/10
                </span>
              )}
              {typeof format === "string" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/60 text-muted-foreground">
                  {format}
                </span>
              )}
              {typeof status === "string" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/60 text-muted-foreground">
                  {status}
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-neutral-400 line-clamp-4 leading-relaxed">
            {recommendation.recommendation}
          </p>
        </div>
      </div>
    </Link>
  );
}
