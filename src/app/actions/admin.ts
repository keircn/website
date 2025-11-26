"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function loginAdmin(
  password: string,
): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: "Admin password not configured" };
  }

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
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
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === "authenticated";
}
