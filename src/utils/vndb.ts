import type { VNDB, VNDBResponse } from "~/types/vndb";

const VNDB_API_URL = "https://api.vndb.org/kana/vn";

export async function fetchVNFromVNDB(vnId: string): Promise<VNDB | null> {
  try {
    const response = await fetch(VNDB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: ["id", "=", vnId],
        fields:
          "title, alttitle, image.url, length, description, rating, votecount, released, languages, platforms",
      }),
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return null;
    }

    const data: VNDBResponse = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.error("Error fetching VN from VNDB:", error);
    return null;
  }
}

export function getVNTitle(vn: VNDB): string {
  return vn.title || vn.alttitle || "Unknown";
}

export function getVNCoverUrl(vn: VNDB, fallback = "/code-xml.svg"): string {
  return vn.image?.url || fallback;
}

export function getVNLengthLabel(length?: number): string {
  if (!length) return "Unknown";
  if (length === 1) return "Very short (< 2 hours)";
  if (length === 2) return "Short (2-10 hours)";
  if (length === 3) return "Medium (10-30 hours)";
  if (length === 4) return "Long (30-50 hours)";
  if (length === 5) return "Very long (> 50 hours)";
  return "Unknown";
}
