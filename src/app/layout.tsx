import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "~/components/Navbar";

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
  title: "Key",
  description: "meow",
  icons: {
    icon: "/avatar.jpg",
  },
  openGraph: {
    title: "Key",
    description: "meow",
    url: "https://keircn.com",
    siteName: "LIBKEY",
    type: "website",
    images: [
      {
        url: "/avatar.jpg",
        width: 736,
        height: 736,
        alt: "avatar",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Key",
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
        <Navbar />
        <main className="pt-28 px-4">{children}</main>
      </body>
    </html>
  );
}
