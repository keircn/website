import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keiran",
  description: "i write code sometimes",
  metadataBase: new URL("https://keircn.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://keircn.com",
    title: "Keiran",
    description: "i write code sometimes",
    siteName: "keircn.com",
    images: [
      {
        url: "https://github.com/keircn.png",
        width: 1080,
        height: 607,
        alt: "avatar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="text-foreground bg-background p-2 min-h-screen">
        {children}
      </body>
    </html>
  );
}
