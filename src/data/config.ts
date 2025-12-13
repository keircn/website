/**
 * Site-wide configuration values
 * Centralized to avoid hardcoding across components
 */

export const siteConfig = {
  name: "Key",
  fullName: "Keiran",
  title: "Key | Developer & Anime Enthusiast",
  description:
    "Personal portfolio of Key (Keiran) - a developer and anime enthusiast from the UK. Explore my projects, anime recommendations, and more.",
  url: "https://keircn.com",
  blogUrl: "https://blog.keircn.com",
  siteName: "LIBKEY",
  locale: "en_GB",
} as const;

export const socialLinks = {
  discord: "/discord",
  github: "/gh",
  githubDirect: "https://github.com/keircn",
  codeberg: "https://codeberg.org/keys",
  anilist: "/al",
  anilistDirect: "https://anilist.co/user/keiran",
  vndb: "https://vndb.org/u320922",
} as const;

export const defaultUsernames = {
  anilist: "keiran",
  github: "keircn",
} as const;

export const seoKeywords = [
  "developer",
  "portfolio",
  "anime",
  "manga",
  "web development",
  "typescript",
  "react",
  "nextjs",
] as const;
