"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/db";
import { guestbookEntries } from "~/db/schema";

export async function getGuestbookEntries() {
  try {
    const entries = await db
      .select()
      .from(guestbookEntries)
      .orderBy(desc(guestbookEntries.createdAt))
      .limit(100);
    return entries;
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return [];
  }
}

export async function signGuestbook(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  if (!name || !message) {
    throw new Error("Name and message are required");
  }

  if (name.length > 50) {
    throw new Error("Name must be less than 50 characters");
  }

  if (message.length > 500) {
    throw new Error("Message must be less than 500 characters");
  }

  try {
    await db.insert(guestbookEntries).values({
      name,
      message,
    });

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to sign guestbook:", error);
    return { success: false, error: "Failed to sign guestbook" };
  }
}
