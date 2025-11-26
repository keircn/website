"use client";

import { motion } from "motion/react";
import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { getGuestbookEntries, signGuestbook } from "~/app/actions/guestbook";
import type { GuestbookEntry } from "~/db/schema";
import { formatFullDate, formatRelativeTime } from "~/utils/date";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-4 py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
    >
      {pending ? "Signing..." : "Sign Guestbook"}
    </button>
  );
}

interface GuestbookData {
  entries: Omit<GuestbookEntry, "ipAddress">[];
  hasMore: boolean;
  currentPage: number;
}

export default function Guestbook({
  initialData,
}: {
  initialData: GuestbookData;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [entries, setEntries] = useState(initialData.entries);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await signGuestbook(formData);
      if (result.success) {
        formRef.current?.reset();
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-background border border-border rounded-xl p-4 sm:p-6 shadow-sm"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Sign the Guestbook
        </h2>
        <form ref={formRef} action={formAction} className="space-y-4">
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
            <div className="order-1 sm:order-2">
              <SubmitButton />
            </div>
          </div>
        </form>
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
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="font-medium text-foreground text-sm sm:text-base">
                {entry.name}
              </h3>
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
              className="px-6 py-2 bg-muted/30 text-foreground rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isPending ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
