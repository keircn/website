"use client";

import { motion } from "motion/react";
import { HiOutlineBookOpen } from "react-icons/hi";

interface ReadingCardProps {
  title: string;
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
}

export default function ReadingCard({
  title,
  isLoading,
  error,
  children,
}: ReadingCardProps) {
  return (
    <motion.div
      className="border border-border bg-muted/10 w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl rounded"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="py-3 border-b border-border flex items-center justify-between mx-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <div className="w-4 h-4 text-muted-foreground">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <HiOutlineBookOpen className="w-4 h-4" aria-label="Book icon" />
          )}
        </div>
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
            Failed to load reading data
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
