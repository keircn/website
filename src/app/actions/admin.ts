"use server";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db } from "~/db";
import { adminSessions } from "~/db/schema";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<
  string,
  { count: number; firstAttempt: number }
>();

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return realIp || "unknown";
}

function checkLoginRateLimit(ip: string): string | null {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    return null;
  }

  if (now - attempt.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return null;
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingMs = LOGIN_RATE_LIMIT_WINDOW - (now - attempt.firstAttempt);
    const remainingMin = Math.ceil(remainingMs / 60000);
    return `Too many login attempts. Please try again in ${remainingMin} minute${remainingMin !== 1 ? "s" : ""}`;
  }

  return null;
}

function recordLoginAttempt(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now - attempt.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    attempt.count++;
  }
}

function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function loginAdmin(
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const ip = await getClientIp();

  const rateLimitError = checkLoginRateLimit(ip);
  if (rateLimitError) {
    return { success: false, error: rateLimitError };
  }

  if (!ADMIN_PASSWORD) {
    return { success: false, error: "Admin password not configured" };
  }

  const passwordBuffer = Buffer.from(password);
  const adminPasswordBuffer = Buffer.from(ADMIN_PASSWORD);

  if (
    passwordBuffer.length === adminPasswordBuffer.length &&
    timingSafeEqual(passwordBuffer, adminPasswordBuffer)
  ) {
    clearLoginAttempts(ip);

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await db.insert(adminSessions).values({
      token,
      expiresAt,
    });

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

  recordLoginAttempt(ip);

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
