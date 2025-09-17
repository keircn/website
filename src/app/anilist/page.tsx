import type { Metadata } from "next";
import AniListViewer from "~/components/AniListViewer";

export const metadata: Metadata = {
  title: "keiran | anilist",
  openGraph: {
    title: "keiran | anilist",
  },
  twitter: {
    title: "keiran | anilist",
  },
};

export default function AniListPage() {
  return (
    <main className="flex-1">
      <AniListViewer />
    </main>
  );
}
