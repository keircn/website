"use client";

import { useEffect, useState } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { getVisitorCount, trackVisitor } from "~/app/actions/visitors";

export default function VisitorCounter({
  initialCount,
}: {
  initialCount: number;
}) {
  const [visitorCount, setVisitorCount] = useState(initialCount);

  useEffect(() => {
    const track = async () => {
      await trackVisitor();
      const count = await getVisitorCount();
      setVisitorCount(count);
    };
    track();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <HiOutlineUsers className="w-4 h-4" aria-hidden="true" />
      <span>
        <span className="font-medium text-foreground">
          {visitorCount.toLocaleString()}
        </span>{" "}
        {visitorCount === 1 ? "visitor" : "visitors"}
      </span>
    </div>
  );
}
