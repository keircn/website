"use server";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "~/db";
import { adminSessions } from "~/db/schema";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
}

export async function loginAdmin(
  password: string,
): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: "Admin password not configured" };
  }

  const passwordBuffer = Buffer.from(password);
  const adminPasswordBuffer = Buffer.from(ADMIN_PASSWORD);

  if (
    passwordBuffer.length === adminPasswordBuffer.length &&
    timingSafeEqual(passwordBuffer, adminPasswordBuffer)
  ) {
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await db.insert(adminSessions).values({
      token,
      expiresAt,
    });

    // Clean up expired sessions periodically
    await cleanupExpiredSessions();

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (session?.value) {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.token, session.value));
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!session?.value) {
    return false;
  }

  const [dbSession] = await db
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.token, session.value))
    .limit(1);

  if (!dbSession) {
    return false;
  }

  // Check if session is expired
  if (dbSession.expiresAt < new Date()) {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.token, session.value));
    return false;
  }

  return true;
}

export async function requireAdmin(): Promise<{
  success: boolean;
  error?: string;
}> {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized" };
  }
  return { success: true };
}
