import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const DISCORD_REDIRECT_URI =
  process.env.DISCORD_REDIRECT_URI ||
  "http://localhost:3000/api/auth/discord/callback";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  global_name: string | null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("discord_oauth_state")?.value;
  cookieStore.delete("discord_oauth_state");

  if (error) {
    return NextResponse.redirect(new URL("/guestbook", BASE_URL));
  }

  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/guestbook?error=invalid_state", BASE_URL),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/guestbook?error=no_code", BASE_URL));
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error(
        "Failed to exchange code for token:",
        await tokenResponse.text(),
      );
      return NextResponse.redirect(
        new URL("/guestbook?error=token_exchange_failed", BASE_URL),
      );
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to fetch user info:", await userResponse.text());
      return NextResponse.redirect(
        new URL("/guestbook?error=user_fetch_failed", BASE_URL),
      );
    }

    const user: DiscordUser = await userResponse.json();
    const discordSession = {
      id: user.id,
      username: user.global_name || user.username,
      avatar: user.avatar,
    };

    cookieStore.set("discord_user", JSON.stringify(discordSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.redirect(new URL("/guestbook", BASE_URL));
  } catch (err) {
    console.error("Discord OAuth error:", err);
    return NextResponse.redirect(
      new URL("/guestbook?error=oauth_failed", BASE_URL),
    );
  }
}
