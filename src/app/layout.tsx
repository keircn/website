import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Sidebar from "~/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "keiran.html",
  description: "<empty>",
  icons: {
    icon: "/code-xml.svg",
  },
  openGraph: {
    title: "keiran.html",
    description: "<empty>",
    url: "https://keircn.com",
    siteName: "keiran.html",
    /* images: [
      {
        url: "https://keircn.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ], */
  },
  twitter: {
    card: "summary_large_image",
    title: "keiran.html",
    description: "<empty>",
    /* images: [
      {
        url: "https://keircn.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ], */
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen overflow-hidden text-foreground bg-background`}
      >
        <Sidebar />
        <div className="md:hidden sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-3 py-2">
            <Link href="/" className="text-xl font-medium tracking-wide">
              Keiran
            </Link>
            <nav className="flex gap-1 overflow-x-auto">
              <Link
                href="/#about"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"
              >
                about
              </Link>
              <Link
                href="/#projects"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"
              >
                projects
              </Link>
              <Link
                href="/anilist"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"
              >
                anilist
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"
              >
                contact
              </Link>
            </nav>
          </div>
        </div>
        <div className="ml-0 md:ml-48 min-h-screen md:h-screen overflow-y-auto scroll-smooth">
          {children}
        </div>
      </body>
    </html>
  );
}
