import { getRecommendations } from "~/app/actions/recommendations";
import Recommendations from "~/components/Recommendations";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Recommendations
          </h1>
          <p className="text-muted-foreground">
            Anime, manga, light novels, and visual novels that I personally
            recommend.
          </p>
        </div>
        <Recommendations initialRecommendations={recommendations} />
      </div>
    </div>
  );
}
