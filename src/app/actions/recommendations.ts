"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "~/db";
import {
  type NewRecommendation,
  type Recommendation,
  recommendations,
} from "~/db/schema";
import { requireAdmin } from "./admin";

export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    return await db
      .select()
      .from(recommendations)
      .orderBy(
        desc(recommendations.sortOrder),
        desc(recommendations.createdAt),
      );
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

export async function getRecommendationsByType(
  type: string,
): Promise<Recommendation[]> {
  try {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.type, type))
      .orderBy(
        desc(recommendations.sortOrder),
        desc(recommendations.createdAt),
      );
  } catch (error) {
    console.error(`Error fetching ${type} recommendations:`, error);
    return [];
  }
}

export async function addRecommendation(
  data: NewRecommendation,
): Promise<{ success: boolean; error?: string }> {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return authCheck;
  }

  try {
    await db.insert(recommendations).values(data);
    return { success: true };
  } catch (error) {
    console.error("Error adding recommendation:", error);
    return { success: false, error: "Failed to add recommendation" };
  }
}

export async function deleteRecommendation(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return authCheck;
  }

  try {
    await db.delete(recommendations).where(eq(recommendations.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    return { success: false, error: "Failed to delete recommendation" };
  }
}

export async function updateRecommendation(
  id: string,
  data: Partial<NewRecommendation>,
): Promise<{ success: boolean; error?: string }> {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return authCheck;
  }

  try {
    await db
      .update(recommendations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(recommendations.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error updating recommendation:", error);
    return { success: false, error: "Failed to update recommendation" };
  }
}
