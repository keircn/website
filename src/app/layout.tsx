import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono min-h-screen flex text-foreground bg-background`}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
