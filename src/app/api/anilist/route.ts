import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AniList API error:", response.status, data);
      return NextResponse.json(
        { error: `AniList API error: ${response.status}`, details: data },
        { status: response.status },
      );
    }

    if (data.errors) {
      console.error("AniList GraphQL errors:", data.errors);
      return NextResponse.json(
        { error: "GraphQL errors", details: data.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
