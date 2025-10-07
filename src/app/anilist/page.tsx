import type { Metadata } from "next";
import AniListViewer from "~/components/AniListViewer";
import ErrorBoundary from "~/components/ErrorBoundary";
import PageContainer from "~/components/PageContainer";

export const metadata: Metadata = {
  title: "keiran | anilist",
  openGraph: {
    title: "keiran | anilist",
    images: [
      {
        url: "/avatar-roxy.jpg",
        width: 736,
        height: 736,
        alt: "keiran avatar",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    title: "keiran | anilist",
    images: ["/avatar-roxy.jpg"],
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
