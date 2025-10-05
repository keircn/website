import type { Metadata } from "next";
import AniListViewer from "~/components/AniListViewer";
import ErrorBoundary from "~/components/ErrorBoundary";
import PageContainer from "~/components/PageContainer";

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
    <PageContainer>
      <ErrorBoundary>
        <AniListViewer />
      </ErrorBoundary>
    </PageContainer>
  );
}
