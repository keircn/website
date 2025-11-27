"use client";

import { motion } from "motion/react";
import Image from "next/image";
import LastfmViewer from "~/components/LastfmViewer";
import Projects from "~/components/Projects";
import RecentAnime from "~/components/RecentAnime";
import RecentManga from "~/components/RecentManga";
import SocialLinks from "~/components/SocialLinks";
import { projects } from "~/data/projects";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] w-full">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-8 lg:gap-12 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-start w-full sm:flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">
            hi, i&apos;m <span className="text-fuchsia-300">key</span>
          </h1>
          <p className="text-base sm:text-lg font-medium text-neutral-400">
            dev · 16 · UK
          </p>
          <p className="text-sm text-neutral-400 mt-4 max-w-md">
            I&apos;m a developer and weeb from the UK. I&apos;ve been using Arch
            for about 2 years and I code sometimes, not that I&apos;m very good
            at it. You may also know me as Keiran.
          </p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <SocialLinks delay={0.4} />
          </motion.div>
        </motion.div>
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            src="/avatar-roxy.jpg"
            alt="avatar"
            className="rounded-2xl w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover"
            width={160}
            height={160}
            priority
          />
        </motion.div>
      </motion.div>
      <div className="flex flex-col space-y-4 sm:space-y-6 mt-8 sm:mt-12 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
        >
          <LastfmViewer />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <RecentManga />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <RecentAnime />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
        >
          <Projects projects={projects} parentDelay={0.6} />
        </motion.div>
      </div>
    </div>
  );
}
