"use client";

import { motion } from "motion/react";
import {
  LuGithub,
  LuMail,
  LuTwitter,
  LuBitcoin,
  LuCheck,
} from "react-icons/lu";
import { FaDiscord, FaPaypal } from "react-icons/fa";
import { useState } from "react";

interface SocialLink {
  name: string;
  url?: string;
  copyText?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/keircn",
    icon: LuGithub,
    color: "hover:text-foreground",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/keiranjs",
    icon: LuTwitter,
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    copyText: "keiran@keircn.com",
    icon: LuMail,
    color: "hover:text-orange-300",
  },
  {
    name: "Bitcoin",
    copyText: "bc1qz5y0l0c86gmwramyshn04wqc4rgyyhhk3ehvec",
    icon: LuBitcoin,
    color: "hover:text-yellow-500",
  },
  {
    name: "PayPal",
    url: "https://paypal.me/prioryio",
    icon: FaPaypal,
    color: "hover:text-blue-400",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/1230319937155760131",
    icon: FaDiscord,
    color: "hover:text-[#7289da]",
  },
];

export function SocialLinks() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="flex items-center space-x-4 mt-4"
    >
      {socialLinks.map((link, index) => {
        const IconComponent = link.icon;
        const isCopied = copiedItem === link.name;

        if (link.copyText) {
          return (
            <motion.button
              key={link.name}
              onClick={() => handleCopyToClipboard(link.copyText!, link.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              className={`text-muted-foreground ${link.color} hover:scale-105 transition-all duration-200 relative group`}
              aria-label={`Copy ${link.name}`}
            >
              <div className="relative cursor-pointer">
                {isCopied ? (
                  <LuCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap"
                  >
                    Copied!
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        }

        return (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            className={`text-muted-foreground ${link.color} hover:scale-105 transition-all duration-200`}
            aria-label={link.name}
          >
            <IconComponent className="w-5 h-5" />
          </motion.a>
        );
      })}
    </motion.div>
  );
}
