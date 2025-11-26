import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const apiCache = pgTable("api_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApiCache = typeof apiCache.$inferSelect;
export type NewApiCache = typeof apiCache.$inferInsert;

export const guestbookEntries = pgTable("guestbook_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GuestbookEntry = typeof guestbookEntries.$inferSelect;
export type NewGuestbookEntry = typeof guestbookEntries.$inferInsert;

export const recommendations = pgTable("recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  externalId: text("external_id").notNull(),
  title: text("title").notNull(),
  recommendation: text("recommendation").notNull(),
  coverImage: text("cover_image"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
