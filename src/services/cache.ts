import { eq, lt, sql } from "drizzle-orm";
import { db } from "../db";
import { apiCache } from "../db/schema";

export class CacheService {
  private static instance: CacheService;
  private lastCleanup: number = 0;
  private dayInMs = 24 * 60 * 60 * 1000;
  private readonly CLEANUP_INTERVAL = this.dayInMs;
  private readonly CACHE_TTL = this.dayInMs / 24;
  private readonly CLEANUP_AGE = 30 * this.dayInMs;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private async cleanupOldEntries(): Promise<void> {
    const cutoffDate = new Date(Date.now() - this.CLEANUP_AGE);

    try {
      await db.delete(apiCache).where(lt(apiCache.createdAt, cutoffDate));

      console.log(
        `Cleaned up cache entries older than ${cutoffDate.toISOString()}`,
      );
    } catch (error) {
      console.error("Error cleaning up old cache entries:", error);
    }
  }

  private async performCleanupIfNeeded(): Promise<void> {
    const now = Date.now();

    if (now - this.lastCleanup > this.CLEANUP_INTERVAL) {
      await this.cleanupOldEntries();
      this.lastCleanup = now;
    }
  }

  async get(key: string): Promise<unknown | null> {
    this.performCleanupIfNeeded().catch(console.error);

    try {
      const result = await db
        .select()
        .from(apiCache)
        .where(eq(apiCache.key, key))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const cached = result[0];
      const now = Date.now();
      const cacheAge = now - cached.updatedAt.getTime();

      if (cacheAge > this.CACHE_TTL) {
        await this.delete(key);
        return null;
      }

      return cached.value;
    } catch (error) {
      console.error("Error getting cached value:", error);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    try {
      await db
        .insert(apiCache)
        .values({
          key,
          value,
        })
        .onConflictDoUpdate({
          target: apiCache.key,
          set: {
            value,
            updatedAt: sql`NOW()`,
          },
        });
    } catch (error) {
      console.error("Error setting cached value:", error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await db.delete(apiCache).where(eq(apiCache.key, key));
    } catch (error) {
      console.error("Error deleting cached value:", error);
    }
  }

  async clear(): Promise<void> {
    try {
      await db.delete(apiCache);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }
}
