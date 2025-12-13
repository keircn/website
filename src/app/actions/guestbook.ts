"use server";

import { and, desc, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "~/db";
import { guestbookEntries } from "~/db/schema";
import { validateContent } from "~/utils/spam";
import { requireAdmin } from "./admin";

const ENTRIES_PER_PAGE = 20;
const RATE_LIMIT_MINUTES = 15;
const MAX_ENTRIES_PER_IP = 3;

async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return realIp;
}

async function checkRateLimit(ipAddress: string): Promise<string | null> {
  const timeThreshold = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000);

  try {
    const recentEntriesFromIp = await db
      .select()
      .from(guestbookEntries)
      .where(
        and(
          gt(guestbookEntries.createdAt, timeThreshold),
          eq(guestbookEntries.ipAddress, ipAddress),
        ),
      );

    if (recentEntriesFromIp.length >= MAX_ENTRIES_PER_IP) {
      return `Please wait ${RATE_LIMIT_MINUTES} minutes between submissions`;
    }

    return null;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return null;
  }
}

export async function getGuestbookEntries(page: number = 1) {
  try {
    const offset = (page - 1) * ENTRIES_PER_PAGE;

    const entries = await db
      .select({
        id: guestbookEntries.id,
        name: guestbookEntries.name,
        message: guestbookEntries.message,
        createdAt: guestbookEntries.createdAt,
      })
      .from(guestbookEntries)
      .orderBy(desc(guestbookEntries.createdAt))
      .limit(ENTRIES_PER_PAGE + 1)
      .offset(offset);

    const hasMore = entries.length > ENTRIES_PER_PAGE;
    const displayEntries = hasMore
      ? entries.slice(0, ENTRIES_PER_PAGE)
      : entries;

    return {
      entries: displayEntries,
      hasMore,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return {
      entries: [],
      hasMore: false,
      currentPage: page,
    };
  }
}

export async function signGuestbook(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  if (!name || !message) {
    return { success: false, error: "Name and message are required" };
  }

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (trimmedName.length < 2) {
    return { success: false, error: "Name must be at least 2 characters" };
  }

  if (trimmedName.length > 50) {
    return { success: false, error: "Name must be less than 50 characters" };
  }

  if (trimmedMessage.length < 3) {
    return { success: false, error: "Message must be at least 3 characters" };
  }

  if (trimmedMessage.length > 500) {
    return {
      success: false,
      error: "Message must be less than 500 characters",
    };
  }

  const spamError = validateContent(trimmedName, trimmedMessage);
  if (spamError) {
    return { success: false, error: spamError };
  }

  const ipAddress = await getClientIp();

  if (ipAddress) {
    const rateLimitError = await checkRateLimit(ipAddress);
    if (rateLimitError) {
      return { success: false, error: rateLimitError };
    }
  }

  try {
    await db.insert(guestbookEntries).values({
      name: trimmedName,
      message: trimmedMessage,
      ipAddress,
    });

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to sign guestbook:", error);
    return { success: false, error: "Failed to sign guestbook" };
  }
}

export async function deleteGuestbookEntry(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return authCheck;
  }

  try {
    await db.delete(guestbookEntries).where(eq(guestbookEntries.id, id));
    revalidatePath("/guestbook");
    revalidatePath("/admin/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete guestbook entry:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}
