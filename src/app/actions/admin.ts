"use server";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const validTokens = new Set<string>();

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
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
    validTokens.add(token);

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
    validTokens.delete(session.value);
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value ? validTokens.has(session.value) : false;
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
