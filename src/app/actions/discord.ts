"use server";

import { cookies } from "next/headers";

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

export async function getDiscordUser(): Promise<DiscordUser | null> {
  const cookieStore = await cookies();
  const discordUserCookie = cookieStore.get("discord_user");

  if (!discordUserCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(discordUserCookie.value) as DiscordUser;
  } catch {
    return null;
  }
}

export async function logoutDiscord(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("discord_user");
  return { success: true };
}
