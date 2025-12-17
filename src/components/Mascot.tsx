"use client";

import Image from "next/image";

export default function Mascot() {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="rounded-lg overflow-hidden bg-transparent">
        <Image
          src="/roxy.gif"
          alt="Roxy"
          width={173}
          height={173}
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
