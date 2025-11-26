import { getRecommendations } from "~/app/actions/recommendations";
import RecommendationsAdmin from "~/components/RecommendationsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminRecommendationsPage() {
  const recommendations = await getRecommendations();

  return <RecommendationsAdmin initialRecommendations={recommendations} />;
}
