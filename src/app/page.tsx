import { HeaderCard } from "~/components/header-card";
import { AnimeCard } from "~/components/anime-card";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <HeaderCard />
          <AnimeCard />
        </div>
      </div>
    </main>
  );
}
