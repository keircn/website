import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "~/app/globals.css";
import ErrorBoundary from "~/components/ErrorBoundary";
import Footer from "~/components/Footer";
import Mascot from "~/components/Mascot";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "~/components/ThemeProvider";
import { seoKeywords, siteConfig } from "~/data/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...seoKeywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  icons: {
    icon: "/avatar.jpg",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    type: "website",
    locale: siteConfig.locale,
    images: [
      {
        url: "/avatar.jpg",
        width: 736,
        height: 736,
        alt: `${siteConfig.name}'s avatar`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen flex flex-col text-foreground bg-background`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 2xl:px-8 3xl:px-12 4xl:px-16">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <Mascot />
        </ThemeProvider>
      </body>
    </html>
  );
}
