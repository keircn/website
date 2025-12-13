import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "~/app/globals.css";
import ErrorBoundary from "~/components/ErrorBoundary";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "~/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keircn.com"),
  title: {
    default: "Key | Developer & Anime Enthusiast",
    template: "%s | Key",
  },
  description:
    "Personal portfolio of Key (Keiran) - a developer and anime enthusiast from the UK. Explore my projects, anime recommendations, and more.",
  keywords: [
    "developer",
    "portfolio",
    "anime",
    "manga",
    "web development",
    "typescript",
    "react",
    "nextjs",
  ],
  authors: [{ name: "Key", url: "https://keircn.com" }],
  creator: "Key",
  icons: {
    icon: "/avatar.jpg",
  },
  openGraph: {
    title: "Key | Developer & Anime Enthusiast",
    description:
      "Personal portfolio of Key (Keiran) - a developer and anime enthusiast from the UK.",
    url: "https://keircn.com",
    siteName: "LIBKEY",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/avatar.jpg",
        width: 736,
        height: 736,
        alt: "Key's avatar",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Key | Developer & Anime Enthusiast",
    description:
      "Personal portfolio of Key (Keiran) - a developer and anime enthusiast from the UK.",
    images: ["/avatar.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen text-foreground bg-background`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 2xl:px-8 3xl:px-12 4xl:px-16">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
