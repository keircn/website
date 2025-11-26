import { db } from "~/db";
import { guestbookEntries } from "~/db/schema";
import { desc } from "drizzle-orm";
import GuestbookAdmin from "~/components/GuestbookAdmin";

export const dynamic = "force-dynamic";

export default async function AdminGuestbookPage() {
  const entries = await db
    .select()
    .from(guestbookEntries)
    .orderBy(desc(guestbookEntries.createdAt))
    .limit(100);

  return <GuestbookAdmin initialEntries={entries} />;
}
