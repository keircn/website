import { getGuestbookEntries } from "~/app/actions/guestbook";
import Guestbook from "~/components/Guestbook";

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-12">
      <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Guestbook</h1>
          <p className="text-muted-foreground">
            Leave a message for me and other visitors!
          </p>
        </div>
        <Guestbook initialEntries={entries} />
      </div>
    </div>
  );
}
