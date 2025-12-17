"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { type DiscordUser, logoutDiscord } from "~/app/actions/discord";
import { getGuestbookEntries, signGuestbook } from "~/app/actions/guestbook";
import type { GuestbookEntry } from "~/db/schema";
import { formatFullDate, formatRelativeTime } from "~/utils/date";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-4 py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base cursor-pointer"
    >
      {pending ? "Signing..." : label}
    </button>
  );
}

function getDiscordAvatarUrl(
  userId: string,
  avatarHash: string | null,
): string {
  if (!avatarHash) {
    const defaultAvatarIndex = (Number(userId) >> 22) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
}

interface GuestbookData {
  entries: Omit<GuestbookEntry, "ipAddress">[];
  hasMore: boolean;
  currentPage: number;
}

export default function Guestbook({
  initialData,
  discordUser,
}: {
  initialData: GuestbookData;
  discordUser: DiscordUser | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [entries, setEntries] = useState(initialData.entries);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [isPending, startTransition] = useTransition();
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);

  const [state, formAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await signGuestbook(formData);
      if (result.success) {
        formRef.current?.reset();
        setShowAnonymousForm(false);
        startTransition(async () => {
          const data = await getGuestbookEntries(1);
          setEntries(data.entries);
          setHasMore(data.hasMore);
          setCurrentPage(1);
        });
      }
      return result;
    },
    null,
  );

  const loadMore = () => {
    startTransition(async () => {
      const data = await getGuestbookEntries(currentPage + 1);
      setEntries([...entries, ...data.entries]);
      setHasMore(data.hasMore);
      setCurrentPage(data.currentPage);
    });
  };

  const handleLogout = async () => {
    await logoutDiscord();
    window.location.reload();
  };

  return (
    <div className="w-full mx-auto space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-background border border-border rounded-xl p-4 sm:p-6 shadow-sm"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Sign the Guestbook
        </h2>

        {discordUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Image
                src={getDiscordAvatarUrl(discordUser.id, discordUser.avatar)}
                alt={discordUser.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Signing as{" "}
                  <a
                    href={`https://discord.com/users/${discordUser.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    @{discordUser.username}
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
            <form ref={formRef} action={formAction} className="space-y-4">
              <input type="hidden" name="useDiscord" value="true" />
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={3}
                  maxLength={500}
                  placeholder="Leave a message..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-red-500 order-2 sm:order-1 min-h-[1.25rem]">
                  {state?.error && state.error}
                </p>
                <div className="order-1 sm:order-2">
                  <SubmitButton label="Sign Guestbook" />
                </div>
              </div>
            </form>
          </div>
        ) : showAnonymousForm ? (
          <div className="space-y-4">
            <form ref={formRef} action={formAction} className="space-y-4">
              <input type="hidden" name="useDiscord" value="false" />
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Your name"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={3}
                  maxLength={500}
                  placeholder="Leave a message..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-red-500 order-2 sm:order-1 min-h-[1.25rem]">
                  {state?.error && state.error}
                </p>
                <div className="flex gap-2 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => setShowAnonymousForm(false)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base cursor-pointer"
                  >
                    Back
                  </button>
                  <SubmitButton label="Sign Anonymously" />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Choose how you&apos;d like to sign the guestbook:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/api/auth/discord"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/30 text-foreground rounded-md font-medium hover:bg-muted/50 transition-colors text-sm sm:text-base"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Sign in with Discord
              </Link>
              <button
                type="button"
                onClick={() => setShowAnonymousForm(true)}
                className="px-4 py-2.5 bg-muted/30 text-foreground rounded-md font-medium hover:bg-muted/50 transition-colors text-sm sm:text-base cursor-pointer"
              >
                Sign Anonymously
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-3 sm:space-y-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-xl p-3 sm:p-4 group"
          >
            <div className="flex items-start gap-3">
              {entry.discordId && entry.discordAvatar !== undefined && (
                <Image
                  src={getDiscordAvatarUrl(
                    entry.discordId,
                    entry.discordAvatar,
                  )}
                  alt={entry.discordUsername || entry.name}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 mb-2">
                  {entry.discordId ? (
                    <a
                      href={`https://discord.com/users/${entry.discordId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-500 hover:underline text-sm sm:text-base"
                    >
                      @{entry.discordUsername || entry.name}
                    </a>
                  ) : (
                    <h3 className="font-medium text-foreground text-sm sm:text-base">
                      {entry.name}
                    </h3>
                  )}
                  <span
                    className="text-xs text-muted-foreground"
                    title={formatFullDate(entry.createdAt)}
                  >
                    {formatRelativeTime(entry.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm break-words whitespace-pre-wrap">
                  {entry.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {entries.length === 0 && !isPending && (
          <p className="text-center text-muted-foreground py-8">
            No entries yet. Be the first to sign!
          </p>
        )}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={loadMore}
              disabled={isPending}
              className="px-6 py-2 bg-muted/30 text-foreground rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium cursor-pointer"
            >
              {isPending ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
