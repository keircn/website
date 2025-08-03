"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function HeaderCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-card/50 p-6 rounded shadow border border-border max-w-4xl w-full"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-foreground mb-2"
          >
            Hey, I&apos;m Keiran
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground text-lg"
          >
            I write code sometimes
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="ml-6"
        >
          <Image
            src="https://github.com/keircn.png"
            alt="avatar"
            height={80}
            width={80}
            className="rounded"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
