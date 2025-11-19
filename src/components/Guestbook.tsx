"use client";

import { motion } from "motion/react";
import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { signGuestbook } from "~/app/actions/guestbook";
import type { GuestbookEntry } from "~/db/schema";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Signing..." : "Sign Guestbook"}
    </button>
  );
}

export default function Guestbook({
  initialEntries,
}: {
  initialEntries: GuestbookEntry[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await signGuestbook(formData);
      if (result.success) {
        formRef.current?.reset();
      }
      return result;
    },
    null,
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Sign the Guestbook</h2>
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
              maxLength={50}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
              maxLength={500}
              placeholder="Leave a message..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-500">
              {state?.error && state.error}
            </p>
            <SubmitButton />
          </div>
        </form>
      </motion.div>

      <div className="space-y-4">
        {initialEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-xl p-4"
          >
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-medium text-foreground">{entry.name}</h3>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{entry.message}</p>
          </motion.div>
        ))}
        {initialEntries.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No entries yet. Be the first to sign!
          </p>
        )}
      </div>
    </div>
  );
}
