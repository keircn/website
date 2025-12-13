"use server";

import { count, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "~/db";
import { visitors } from "~/db/schema";

async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return realIp;
}

async function getClientUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("user-agent");
}

export async function trackVisitor(): Promise<void> {
  try {
    const ipAddress = await getClientIp();

    if (!ipAddress) {
      return;
    }

    const userAgent = await getClientUserAgent();

    await db
      .insert(visitors)
      .values({
        ipAddress,
        userAgent,
      })
      .onConflictDoUpdate({
        target: visitors.ipAddress,
        set: {
          lastVisit: sql`NOW()`,
          visitCount: sql`${visitors.visitCount} + 1`,
        },
      });
  } catch (error) {
    console.error("Failed to track visitor:", error);
  }
}

export async function getVisitorCount(): Promise<number> {
  try {
    const result = await db.select({ count: count() }).from(visitors);
    return result[0]?.count ?? 0;
  } catch (error) {
    console.error("Failed to get visitor count:", error);
    return 0;
  }
}

export async function getTotalVisits(): Promise<number> {
  try {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${visitors.visitCount}), 0)` })
      .from(visitors);
    return Number(result[0]?.total) || 0;
  } catch (error) {
    console.error("Failed to get total visits:", error);
    return 0;
  }
}
