import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://keircn.com"),
  title: "keiran",
  description: "meow",
  icons: {
    icon: "/code-xml.svg",
  },
  openGraph: {
    title: "keiran",
    description: "meow",
    url: "https://keircn.com",
    siteName: "keircn.com",
    type: "website",
    images: [
      {
        url: "/avatar.jpg",
        width: 736,
        height: 736,
        alt: "keiran avatar",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "keiran",
    description: "meow",
    images: ["/avatar.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen text-foreground bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
