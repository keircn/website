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
  title: "keiran",
  description: "fuck",
  icons: {
    icon: "/code-xml.svg",
  },
  openGraph: {
    title: "keiran",
    description: "fuck",
    url: "https://keircn.com",
    siteName: "keircn.com",
    images: [
      {
        url: "/avatar-roxy.jpg",
        width: 736,
        height: 736,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "keiran",
    description: "fuck",
    images: [
      {
        url: "/avatar-roxy.jpg",
        width: 736,
        height: 736,
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen md:overflow-hidden text-foreground bg-background`}
      >
        <Sidebar />
        <div className="md:hidden sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
            >
              Keiran
            </Link>
            <nav className="flex gap-1 overflow-x-auto">
              <Link
                href="/#about"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/40 transition-all font-medium whitespace-nowrap"
              >
                about
              </Link>
              <Link
                href="/#projects"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/40 transition-all font-medium whitespace-nowrap"
              >
                projects
              </Link>
              <Link
                href="/anilist"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/40 transition-all font-medium whitespace-nowrap"
              >
                anilist
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/40 transition-all font-medium whitespace-nowrap"
              >
                contact
              </Link>
            </nav>
          </div>
        </div>
        <div className="ml-0 md:ml-52 min-h-screen md:h-screen overflow-y-auto scroll-smooth">
          {children}
        </div>
      </body>
    </html>
  );
}
